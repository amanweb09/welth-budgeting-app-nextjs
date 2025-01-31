"use client";

import { Account, Transaction } from '@prisma/client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { PieChart, Pie, ResponsiveContainer, Cell, Legend } from "recharts"

interface IPropTypes {
    accounts: Account[],
    transactions: Transaction[]
}

const colors = ["#ff6868", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeead", "#d4a5a5", "#9fa8da"]

const DashboardOverview = ({
    accounts, transactions
}: IPropTypes) => {

    const [selectedAccountId, setSelectedAccountId] = useState(accounts.find(a => a.isDefault)?.id || accounts[0]?.id)

    const accountTransactions = transactions.filter(t => t.accountId === selectedAccountId)

    const recentTransactions = transactions.sort((a, b) => +b.date - +a.date).slice(0, 5)

    const currentDate = new Date()
    const currentMonthExpenses = accountTransactions.filter(t => {
        const trDate = new Date(t.date)
        return t.type === "EXPENSE" && trDate.getMonth() === currentDate.getMonth() && trDate.getFullYear() === currentDate.getFullYear()
    })

    const expenseGroupedByCategory = currentMonthExpenses.length && currentMonthExpenses.reduce((acc, t) => {
        const category = t.category
        if (!acc[category]) {
            acc[category] = 0
        }
        acc[category] += t.amount
        return acc
    }, {} as Record<string, any>)

    const pieChartData = Object.entries(expenseGroupedByCategory).map(([name, amount]) => {
        return { name, value: amount }
    })

    return (
        <div className='grid gap-4 md:grid-cols-2'>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
                    <CardTitle className='text-base text-normal'>
                        Recent Transactions
                    </CardTitle>
                    <Select
                        onValueChange={setSelectedAccountId}
                        value={selectedAccountId}>
                        <SelectTrigger className='w-[140px]'>
                            <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                accounts.map(a => {
                                    return <SelectItem
                                        key={a.id}
                                        value={a.id}>
                                        {a.name}
                                    </SelectItem>
                                })
                            }
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent>
                    <div className='space-y-4'>
                        {
                            recentTransactions.length === 0
                                ?
                                <p className='text-center text-muted-foreground py-4'>
                                    No recent transactions
                                </p>
                                :
                                recentTransactions.map(t => {
                                    return <div
                                        key={t.id}
                                        className='flex items-center justify-between'>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {t.description || "Untitled Transaction"}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {format(new Date(t.date), "pp")}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={cn(
                                                    "flex items-center",
                                                    t.type === "EXPENSE"
                                                        ? "text-red-500"
                                                        : "text-green-500")}>
                                                {
                                                    t.type === "EXPENSE"
                                                        ?
                                                        <ArrowDownRight className='mr-1 h-4 w-4' />
                                                        :
                                                        <ArrowUpRight className='mr-1 h-4 w-4' />
                                                }
                                                &#8377;{t.amount.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                })
                        }
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className='text-base font-normal'>
                        Monthly Expense Breakdown
                    </CardTitle>
                </CardHeader>
                <CardContent className='p-0 pb-5'>
                    {
                        pieChartData.length === 0
                            ?
                            <p className="text-center text-muted-foreground py-4">
                                No expenses this month
                            </p>
                            :
                            <div className='h-[300px]'>
                                <ResponsiveContainer width={"100%"} height={"100%"}>
                                    <PieChart >
                                        <Pie
                                            data={pieChartData}
                                            cx={"50%"}
                                            cy={"50%"}
                                            fill='#8884d8'
                                            outerRadius={80}
                                            dataKey={"value"}
                                            label={({ name, value }) => `${name}: Rs.${value.toFixed()}`}>
                                            {
                                                pieChartData.map((entry, ix) => {
                                                    return <Cell key={ix} color={colors[ix % colors.length]}/>
                                                })
                                            }
                                        </Pie>
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                    }
                </CardContent>
            </Card>
        </div>
    )
}

export default DashboardOverview