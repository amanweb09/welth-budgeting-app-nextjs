"use server";

import { db } from "@/lib/prisma"
import serializeData from "@/lib/serializer";
import { auth } from "@clerk/nextjs/server"
import { Transaction } from "@/prisma/generated/client";
import { revalidatePath } from "next/cache"


export const updateDefaultAccount = async (accountId: string) => {
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

        await db.account.updateMany({
            where: { userId: user.id, isDefault: true },
            data: { isDefault: false }
        })

        const account = await db.account.update({
            where: {
                id: accountId,
                userId: user.id
            },
            data: { isDefault: true }
        })

        revalidatePath("/dashboard")
        return { success: true, data: await serializeData(account) }

    } catch (error: any) {
        console.log(error);
        return { success: false, data: error.message }
    }
}

export const getAccountWithTransactions = async (accountId: string) => {
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
            id: accountId,
            userId: user.id
        },
        include: {
            transactions: {
                orderBy: { date: "desc" }
            },
            _count: {
                select: { transactions: true }
            }
        }
    })

    if (!account) return null

    return {
        ...serializeData(account),
        transactions: account.transactions.map(((t: Transaction) => serializeData(t)))
    }
}

export const bulkDeleteTransactions = async (tIds: string[]) => {
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

        const transactions = await db.transaction.findMany({
            where: {
                id: { in: tIds },
                userId: user.id
            }
        })

        const accountBalanceChange = transactions.reduce((acc: any, t: Transaction) => {
            const change = t.type === "EXPENSE" ? t.amount : -t.amount
            acc[t.accountId] = (acc[t.accountId] || 0) + change
            return acc
        }, {})

        // delete transactions
        // when we want to do multiple API calls in db and ensure that even if one transaction
        // fails, entire process is considered failed, we use $transaction 
        await db.$transaction(async (_db:any) => {
            await _db.transaction.deleteMany({
                where: {
                    id: {in: tIds},
                    userId: user.id
                }
            })

            for(const [accountId, balanceChange] of Object.entries(accountBalanceChange)) {
                await _db.account.update({
                    where: {id: accountId},
                    data: {
                        balance: {
                            increment: balanceChange
                        }
                    }
                })
            }
        })

        revalidatePath("/dashboard")
        revalidatePath("/account/[id]")

        return {success: true}
    } catch (error:any) {
        return {success: false, message: error.message}
    }
}