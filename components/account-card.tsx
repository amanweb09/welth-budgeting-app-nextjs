"use client";

import { Account } from "@/prisma/generated/client";
import React, { useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Switch } from './ui/switch'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import useFetch from '@/hooks/useFetch'
import { updateDefaultAccount } from '@/app/actions/account'
import { toast } from 'sonner'

const AccountCard = ({ account }: { account: Account }) => {

    const { name, id, isDefault, balance, type } = account

    const {
        error,
        fn: updateDefaultFn,
        loading: updateDefaultLoading,
        closeDrawer: isSuccessful
    } = useFetch(updateDefaultAccount)

    const handleDefaultChange = async(e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        if(isDefault) {
            toast.warning("You need atleast 1 default account")
            return;
        }

        await updateDefaultFn(id)
    }

    useEffect(() => {
        if(isSuccessful) {
            toast.success("Default account updated successfully")
        }
    }, [isSuccessful])

    useEffect(() => {
        if(error) {
            toast.error(error.message || "Something went wrong")
        }
    }, [error])

    return (
        <Card className='hover:shadow-md transition-shadow group relative'>
            <Link href={"/account/" + id}>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium capitalize'>{name}</CardTitle>
                    <Switch 
                    disabled={updateDefaultLoading}
                    checked={isDefault}
                    onClick={handleDefaultChange}/>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        &#8377;{balance.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">
                        {type} Account
                    </p>
                </CardContent>
                <CardFooter className='flex justify-between text-sm text-muted-foreground'>
                    <div className="flex items-center">
                        <ArrowRight className='mr-1 h-4 w-4 text-green-500' />
                        Income
                    </div>
                    <div className="flex items-center">
                        <ArrowLeft className='mr-1 h-4 w-4 text-red-500' />
                        Expense
                    </div>
                </CardFooter>
            </Link>
        </Card>
    )
}

export default AccountCard