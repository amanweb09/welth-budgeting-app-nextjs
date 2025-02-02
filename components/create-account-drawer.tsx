"use client"

import React, { useEffect, useState } from 'react'
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Switch } from './ui/switch'
import { Button } from './ui/button'
import { validateAccount } from '@/lib/form-schema'
import { IAccountDetails } from '@/types'
import useFetch from '@/hooks/useFetch'
import createAccount from '@/app/actions/dashboard'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const CreateAccountDrawer = ({ children }: { children: React.ReactNode }) => {

    const [open, setOpen] = useState(false)

    const [details, setDetails] = useState<IAccountDetails>({ name: "", type: "SAVINGS", balance: "", isDefault: true })

    const {
        error,
        fn: createAccountFunction,
        loading: createAccountLoading,
        closeDrawer } = useFetch(() => createAccount(details))

    useEffect(() => {
        if (closeDrawer) {
            setDetails({ name: "", type: "SAVINGS", balance: "", isDefault: true })
            setOpen(false)
            toast.success("Account created successfully")
        }
    }, [closeDrawer])

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Failed to create account")
        }
    }, [error])

    const submitForm = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        const validate = validateAccount(details)

        if (!validate.success) {
            alert(validate.error.message[0])
            return;
        }

        // make api call
        await createAccountFunction()

    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>{children}</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Create New Account</DrawerTitle>
                </DrawerHeader>

                <div className='px-4 pb-4'>
                    <form
                        action="POST"
                        className='space-y-4'>
                        <div className='space-y-2'>
                            <label htmlFor="name" className='text-sm font-medium'>Account Name</label>
                            <Input
                                onChange={(e) => setDetails({ ...details, name: e.target.value })}
                                value={details.name}
                                id='name'
                                placeholder='e.g. Main Checking' />
                        </div>

                        <div className='space-y-2'>
                            <label htmlFor="type" className='text-sm font-medium'>
                                Account Type
                            </label>
                            <Select
                                defaultValue={"SAVINGS"}
                                onValueChange={(value) => setDetails({ ...details, type: value })}>
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='SAVINGS'>Saving</SelectItem>
                                    <SelectItem value='CURRENT'>Current</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className='space-y-2'>
                            <label htmlFor="balance" className='text-sm font-medium'>
                                Initial Balance
                            </label>
                            <Input
                                onChange={(e) => setDetails({ ...details, balance: e.target.value })}
                                value={details.balance}
                                id='balace'
                                type='number'
                                step={"0.01"}
                                placeholder='0.00' />
                        </div>

                        <div className='space-y-2 flex items-center justify-between rounded-lg border p-3'>
                            <div className='space-y-0.5'>
                                <label
                                    htmlFor="name"
                                    className='text-sm font-medium cursor-pointer'>
                                    Set as Default
                                </label>
                                <p className='text-sm to-muted-foreground'>
                                    This account will be selected by default for transactions
                                </p>
                            </div>
                            <Switch
                                checked={details.isDefault}
                                defaultValue={details.isDefault.toString()}
                                onCheckedChange={() => setDetails({ ...details, isDefault: !details.isDefault })}
                                id="isDefault" />
                        </div>
                        <div className='flex gap-4 pt-4'>
                            <DrawerClose asChild>
                                <Button
                                    className='flex-1'
                                    variant={"outline"}
                                    type='button'>
                                    Cancel
                                </Button>
                            </DrawerClose>
                            <Button
                                disabled={createAccountLoading}
                                onClick={submitForm}
                                type='submit'
                                className='flex-1'>
                                {
                                    createAccountLoading
                                        ?
                                        <>
                                            <Loader2
                                                className='mr-2 h-4 w-4 animate-spin' />
                                            Creating...
                                        </>
                                        :
                                        <>Create Account</>
                                }
                            </Button>
                        </div>
                    </form>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default CreateAccountDrawer
