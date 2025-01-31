"use server";

import { db } from "@/lib/prisma";
import serializeData from "@/lib/serializer";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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
                where: {id: data.accountId},
                data: {balance: newBalance}
            })

            return newTransaction
        })

        revalidatePath("/dashboard")
        revalidatePath(`/account/${transaction.accountId}`)

        return {success: true, data: serializeData(transaction)}
    } catch (error:any) {
        throw new Error(error.message)
    }
}
