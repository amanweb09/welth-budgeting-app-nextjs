import { defaultCategories } from "@/data/categories"

export interface IAccountDetails {
    name: string,
    type: string,
    balance: string,
    isDefault: boolean
}

export interface IRouteWithParam {
    params: Promise<{ id: string }>
}

export interface ICategory {
    id: string,
    name: string,
    type: string,
    color: string,
    icon: string
}


export interface ITransactionData {
    type: string,
    amount: string,
    description: string,
    date: Date | undefined,
    accountId: string,
    category: string,
    isRecurring: boolean,
    recurringInterval: string
}

export interface IAIReciptData {
    amount: string,
    description: string,
    date: Date | undefined,
    category: string,
    merchantName: string
}