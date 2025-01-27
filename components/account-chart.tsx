"use client";

import { Transaction } from '@prisma/client'
import { endOfDay, format, startOfDay, subDays } from 'date-fns';
import React, { useMemo, useState } from 'react'

const DATE_RANGES = {
    "7D": {label: "Last 7 Days", days: 7},
    "1M": {label: "Last Month", days: 30},
    "3M": {label: "Last 3 Months", days: 90},
    "6M": {label: "Last 6 Days", days: 180},
    ALL: {label: "All Time", days: null},
}

interface IAcc {
    
}

type TDateRanges = "7D"|"1M"|"3M"|"6M"|"ALL"

const AccountChart = ({ transactions }: { transactions: Transaction[] }) => {

    const [dateRange, setDateRange] = useState<TDateRanges>("1M")

    const filteredData = useMemo(() => {
        const range = DATE_RANGES[dateRange]
        const now = new Date()

        const startDate = range.days 
        ?
        startOfDay(subDays(now, range.days))    // subtract 30 days from today
        :
        startOfDay(new Date(0)) //consider the oldest date

        const fileterd = transactions.filter(t => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now))

        // const grouped = fileterd.reduce((acc, t) => {
        //     const date = format(new Date(t.date), "MMM dd")

        //     if(!acc[date]) {
        //         acc[date] = {date, income: 0, expense: 0}
        //     }

        //     if(t.type === "INCOME") {
        //         acc[date].income += t.amount
        //     } else {
        //         acc[date].expense += t.amount
        //     }

        //     return acc
        // }, {})

        // convert to array
        // return Object.values(grouped).sort((a:any, b:any) => +a.date - +b.date)
    }, [transactions, dateRange])
    return (
        <div>

        </div>
    )
}

export default AccountChart