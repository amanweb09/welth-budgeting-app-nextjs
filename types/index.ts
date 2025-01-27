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
