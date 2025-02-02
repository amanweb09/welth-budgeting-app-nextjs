"use server";

import { db } from "@/lib/prisma";
import serializeData from "@/lib/serializer";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai"
import { IAIReciptData } from "@/types";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export const createTransaction = async (data: any) => {
    try {
        const { userId } = await auth()
        if (!userId) throw new Error("Unauthorised")

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId
            }
        })

        if (!user) {
            throw new Error("User not found")
        }

        const account = await db.account.findUnique({
            where: {
                id: data.accountId,
                userId: user.id
            }
        })

        if (!account) throw new Error("Account not found")

        const balanceChange = data.type === "EXPENSE" ? -(+data.amount) : +data.amount
        const newBalance = account.balance.toNumber() + balanceChange

        const transaction = await db.$transaction(async (_db: any) => {
            const newTransaction = await _db.transaction.create({
                data: {
                    ...data,
                    userId: user.id
                }
            })

            await _db.account.update({
                where: { id: data.accountId },
                data: { balance: newBalance }
            })

            return newTransaction
        })

        revalidatePath("/dashboard")
        revalidatePath(`/account/${transaction.accountId}`)

        return { success: true, data: serializeData(transaction) }
    } catch (error: any) {
        throw new Error(error.message)
    }
}

export const scanReceipt = async (file: File) => {
    const MODEL = "gemini-1.5-flash"
    try {
        const model = genAi.getGenerativeModel({ model: MODEL })

        // convert to array buffer for the model
        const arrayBuffer = await file.arrayBuffer()

        // convert to base64
        const b64 = Buffer.from(arrayBuffer).toString("base64")

        const promp = `
        Analyze this receipt and extract the following information in jSON format:
        - total amount (just the number)
        - date (in ISO format)
        - description  or items purchased (brief summary)
        - merchant/store name
        - suggested categories (one of: housing, transaportation, groceries, utilities, entertainment, food, shopping, healthcare, education, personal, travel, insurance, gifts, bills, other-expenses)

        Only respond with valid JSON in this exact format:
        {
            "amount": number,
            "date": "ISO date string",
            "description":"string",
            "merchantName": "string",
            "category": "string"
        }

        If it's not a receipt, return an empty object
        `

        const result = await model.generateContent([
            promp,
            {
                inlineData: {
                    data: b64,
                    mimeType: file.type
                }
            }
        ])

        const response = result.response
        const text = response.text()

        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim()

        try {
            const data:IAIReciptData = JSON.parse(cleanedText)
            return {
                amount: data.amount,
                date: data.date,
                description: data.description,
                category: data.category,
                merchantName: data.merchantName
            }
        } catch (parseError:any) {
            console.log("Error parsing JSON", parseError);
            throw new Error("Invalid response format from Gemini")   
        }
    }
    catch (error) {
        console.log(error);
        throw new Error("Failed to scan receipt")
    }
}