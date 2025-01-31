"use client";

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Check, Pencil, X } from 'lucide-react'
import useFetch from '@/hooks/useFetch';
import { updateBudget } from '@/app/actions/budget';
import { toast } from 'sonner';
import { Progress } from './ui/progress';

interface IPropTypes {
    initialBudget: any,
    currentExpenses: number
}
const BudgetProgress = ({ initialBudget, currentExpenses }: IPropTypes) => {

    const [isEditing, setIsEditing] = useState(false)
    const [newBudget, setNewBudget] = useState(initialBudget?.amount?.toString() || "")

    const percentageUsed = initialBudget ? (currentExpenses / initialBudget.amount) * 100 : 0

    const {
        loading: isLoading,
        fn: updateBudgetFn,
        data: updatedBudget,
        error,
        closeDrawer: isSuccessful
    } = useFetch(updateBudget)

    const handleUpdateBudget = async () => {
        const amount = parseFloat(newBudget)
        if (isNaN(amount) || amount < 0) {
            toast.error("Please enter a valid amount")
            return;
        }

        await updateBudgetFn(amount)
    }

    useEffect(() => {
        if (isSuccessful) {
            toast.success("Budget updated successfully!")
        }
    }, [isSuccessful])

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Failed to update budget")
        }
    }, [error])

    const handleCancel = () => {
        setNewBudget(initialBudget?.amount?.toString() || "")
        setIsEditing(false)
    }

    return (
        <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <div className='flex-1'>
                    <CardTitle>Monthly Budget (Default Account)</CardTitle>
                    <div className='flex items-center gap-2 mt-1'>
                        {
                            isEditing
                                ?
                                <div className='flex items-center gap-2'>
                                    <Input
                                        className='w-32'
                                        placeholder='Enter amount'
                                        autoFocus
                                        value={newBudget}
                                        onChange={(e) => setNewBudget(+e.target.value)}
                                        type='number'
                                        disabled={isLoading} />
                                    <Button
                                        disabled={isLoading}
                                        onClick={handleUpdateBudget}
                                        variant={"ghost"}
                                        size={"icon"}>
                                        <Check className='h-4 w-4 text-green-500' />
                                    </Button>
                                    <Button
                                        disabled={isLoading}
                                        onClick={handleCancel}
                                        variant={"ghost"}
                                        size={"icon"}>
                                        <X className='h-4 w-4 text-red-500' />
                                    </Button>
                                </div> : <>
                                    <CardDescription>
                                        {
                                            initialBudget
                                                ?
                                                `Rs.${currentExpenses.toFixed(2)} of Rs.${initialBudget.amount.toFixed(2)} spent`
                                                :
                                                "No Budget Found"
                                        }
                                    </CardDescription>
                                    <Button
                                        size={"icon"}
                                        onClick={() => setIsEditing(true)}
                                        className='h-6 w-6'
                                        variant={"ghost"}>
                                        <Pencil className='h-3 w-3' />
                                    </Button>
                                </>
                        }
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {
                    initialBudget
                    &&
                    <div className='space-y-2'>
                        <Progress
                            style={{
                                color: percentageUsed >= 90
                                    ? "red"
                                    : percentageUsed >= 75
                                        ? "yellow"
                                        : "green"
                            }}
                            value={percentageUsed} />
                        <p className='text-xs to-muted-foreground text-right'>
                            {percentageUsed.toFixed(1)}% used
                        </p>
                    </div>
                }
            </CardContent>
        </Card>
    )
}

export default BudgetProgress