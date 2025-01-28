import { IAccountDetails, ITransactionData } from "@/types"
import { z } from "zod"

export const accountSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(["CURRENT", "SAVINGS"]),
    balance: z.string().min(1, "Initial balance is required"),
    isDefault: z.boolean().default(false)
})

export const transactionSchema = z.object({
    type: z.enum(["CURRENT", "SAVINGS"]),
    amount: z.string().min(1, "Amount is required"),
    description: z.string().min(2, "Please provide description"), 
    date: z.date(), 
    accountId: z.string().min(2, "Please select an account"), 
    category: z.string().min(2, "Please select a category"), 
    isRecurring: z.boolean().default(false), 
    recurringInterval: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]) 
})

export const validateAccount = (data:IAccountDetails) => {
    return accountSchema.safeParse(data)
}

export const validateTransaction = (data:ITransactionData) => {
    return transactionSchema.safeParse(data)
}