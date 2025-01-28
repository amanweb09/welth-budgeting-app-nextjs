"use client";

import { createTransaction } from "@/app/actions/transaction";
import CreateAccountDrawer from "@/components/create-account-drawer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import useFetch from "@/hooks/useFetch";
import { ICategory, ITransactionData } from "@/types";
import { Account } from "@prisma/client";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import { toast } from "sonner";
import { validateTransaction } from "@/lib/form-schema";

interface IPropTypes {
    accounts: Account[],
    categories: ICategory[]
}


const AddTransactionForm = ({ accounts, categories }: IPropTypes) => {

    const router = useRouter()

    const [data, setData] = useState<ITransactionData>({ type: "EXPENSE", amount: "", description: "", date: new Date(), accountId: "", category: "", isRecurring: false, recurringInterval: "MONTHLY" })

    const {
        loading: trLoading,
        fn: TrFn,
        closeDrawer: isSuccessful
    } = useFetch(() => createTransaction(data))

    const filteredCategories = categories.filter(c => c.type === data.type)

    const handleSubmit = async (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const validate = validateTransaction(data)

        if (!validate.success) {
            toast.error(validate.error.message[0])
            return;
        }

        const formData = {...data, amount: +data.amount}

        TrFn(formData)
    }

    useEffect(() => {
        if(isSuccessful) {
            toast.success("Transaction added successfully!")
            router.push("/account/"+data.accountId)
        }
    }, [isSuccessful])

    return (
        <form className="space-y-6">
            {/* AI Scanner */}

            <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select
                    defaultValue={data.type}
                    onValueChange={v => setData({ ...data, type: v })}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="INCOME">Income</SelectItem>
                        <SelectItem value="EXPENSE">Expense</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Amount</label>
                    <Input
                        onChange={e => setData({ ...data, amount: e.target.value })}
                        value={data.amount}
                        step={0.01}
                        placeholder="0.0"
                        type="number" />
                </div>
                <div>
                    <label className="text-sm font-medium">Account</label>
                    <Select
                        defaultValue={data.accountId}
                        onValueChange={v => setData({ ...data, accountId: v })}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                accounts.map((a) => {
                                    return <SelectItem
                                        key={a.id}
                                        value={a.id}>
                                        {a.name} Rs. {a.balance.toFixed(2)}
                                    </SelectItem>
                                })
                            }
                            <CreateAccountDrawer>
                                <Button
                                    className="w-full select-none items-center text-sm outline-none"
                                    variant={"ghost"}>
                                    Create an Account
                                </Button>
                            </CreateAccountDrawer>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                    defaultValue={data.type}
                    onValueChange={v => setData({ ...data, category: v })}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            filteredCategories.map((c) => {
                                return <SelectItem
                                    key={c.id}
                                    value={c.id}>
                                    {c.name}
                                </SelectItem>
                            })
                        }
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            className="w-full pl-3 text-left font-normal"
                            variant={"outline"}>
                            {data.date ? format(data.date, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <Calendar
                            selected={data.date}
                            onSelect={d => setData({ ...data, date: d })}
                            disabled={d => d > new Date() || d < new Date("1900-01-01")}
                            mode="single" />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                    onChange={e => setData({ ...data, description: e.target.value })}
                    value={data.description}
                    placeholder="Enter description..." />
            </div>

            <div className='space-y-2 flex items-center justify-between rounded-lg border p-3'>
                <div className='space-y-0.5'>
                    <label
                        htmlFor="name"
                        className='text-sm font-medium cursor-pointer'>
                        Recurring Transaction
                    </label>
                </div>
                <Switch
                    checked={data.isRecurring}
                    defaultValue={data.isRecurring.toString()}
                    onCheckedChange={() => setData({ ...data, isRecurring: !data.isRecurring })} />
            </div>

            <div>
                {
                    data.isRecurring
                    &&
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Recurring Interval</label>
                        <Select
                            defaultValue={data.recurringInterval}
                            onValueChange={v => setData({ ...data, recurringInterval: v })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Interval" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DAILY">Daily</SelectItem>
                                <SelectItem value="WEEKLY">Weekly</SelectItem>
                                <SelectItem value="MONTHLY">Monthly</SelectItem>
                                <SelectItem value="YEARLY">Yearly</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                }

            </div>
            <div className="flex gap-4">
                <Button
                    type="button"
                    variant={"outline"}
                    onClick={() => router.back()}
                    className="w-full">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    disabled={trLoading}
                    type="submit"
                    className="w-full">
                    Create Transaction
                </Button>
            </div>
        </form>
    )
}

export default AddTransactionForm