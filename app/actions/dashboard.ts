"use server"

import { db } from "@/lib/prisma"
import serializeData from "@/lib/serializer"
import { auth } from "@clerk/nextjs/server"
import { Account } from "@prisma/client"
import { revalidatePath } from "next/cache"

const createAccount = async (data: any) => {
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

        const balaceFloat = parseFloat(data.balance)

        if (isNaN(balaceFloat)) throw new Error("Invalid Balance Amount")

        // check if this is user's 1st account
        const existingAccounts = await db.account.findMany({
            where: {
                userId: user.id
            }
        })

        const isdefaultAccount = existingAccounts.length === 0 ? true : data.isDefault

        // if user wants this as default account, we need to mark other accounts as not default
        if (isdefaultAccount) {
            await db.account.updateMany({
                where: { userId: user.id, isDefault: true },
                data: { isDefault: false }
            })
        }

        const account = await db.account.create({
            data: {
                ...data,
                balance: balaceFloat,
                userId: user.id,
                isDefault: isdefaultAccount
            }
        })

        const serializedAccount = serializeData(account)
        // refetch dashboard to show updated data
        revalidatePath("/dashboard")

        return serializedAccount
    } catch (error) {
        console.log(error);
        throw new Error("Something went wrong")
    }
}

export const getUserAccounts = async () => {
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

    const accounts = await db.account.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: {
                    transactions: true
                }
            }
        }
    })

    const serializedAccounts = accounts.map((a:Account) => serializeData(a))

    return serializedAccounts
}

export default createAccount