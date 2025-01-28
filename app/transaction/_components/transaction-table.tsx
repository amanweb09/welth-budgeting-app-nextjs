"use client";

import { bulkDeleteTransactions } from '@/app/actions/account';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox'
import { Command } from '@/components/ui/command';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { categoryColors } from '@/data/categories';
import useFetch from '@/hooks/useFetch';
import { Transaction } from '@prisma/client'
import { format } from 'date-fns';
import { ChevronDown, ChevronUp, Clock, MoreHorizontal, RefreshCw, Search, Trash, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'
import { BarLoader } from 'react-spinners';
import { toast } from 'sonner';

const TransactionTable = ({ transactions }: { transactions: Transaction[] }) => {

    const router = useRouter()
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [sortingConfig, setSortingConfig] = useState({
        field: "date",
        direction: "desc"
    })
    const [searchTerm, setSearchTerm] = useState("")
    const [typeFilter, setTypefilter] = useState("")
    const [recurringfilter, setRecurringFilter] = useState("")

    const filteredAndSortedTransactions = useMemo(() => {
        let result = [...transactions]

        // apply search filters
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase()
            result = result.filter((t) => t.description?.toLowerCase().includes(searchLower))
        }

        // recurring filter
        if (recurringfilter) {
            result = result.filter(t => {
                if (recurringfilter === "recurring") return t.isRecurring
                return !t.isRecurring
            })
        }

        // type filter
        if (typeFilter) {
            result = result.filter(t => t.type === typeFilter)
        }

        // sorting
        result.sort((a, b): any => {
            let comparison: any = 0;

            switch (sortingConfig.field) {
                case "date":
                    comparison = +a.date - +b.date
                    break;
                case "amount":
                    comparison = +a.amount.toString() - +b.amount.toString()
                    break;
                case "category":
                    comparison = a.category.localeCompare(b.category)
                    break;
                default:
                    comparison = 0
            }

            return sortingConfig.direction === "asc" ? comparison : -comparison
        })
        return result
    }, [transactions, searchTerm, typeFilter, recurringfilter, sortingConfig])

    const {
        loading: deleteLoading,
        error,
        fn: deleteFn,
        data: deleted,
        closeDrawer: isSuccessful
    } = useFetch(bulkDeleteTransactions)

    const handleSort = (field: string) => {
        setSortingConfig({
            field,
            direction: sortingConfig.field == field && sortingConfig.direction == "asc" ? "desc" : "asc"
        })
    }

    const handleSelect = (id: string) => {
        setSelectedIds(
            selectedIds.includes(id)
                ?
                selectedIds.filter((item: string) => item != id)
                :
                [...selectedIds, id])
    }

    const handleSelectAll = () => {
        setSelectedIds(
            selectedIds.length === filteredAndSortedTransactions.length
                ?
                []
                :
                filteredAndSortedTransactions.map((t: Transaction) => t.id))
    }

    const handleBulkDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} transactions?`)) return;

        deleteFn(selectedIds)
    }

    useEffect(() => {
        if (isSuccessful) {
            toast.success("Transactions deleted successfully")
        }
    }, [isSuccessful])

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Failed to delete transactions")
        }
    }, [error])

    const handleClearFilters = () => {
        setSearchTerm("")
        setTypefilter("")
        setRecurringFilter("")
        setSelectedIds([])
    }

    return (
        <div className='space-y-4'>
            {
                deleteLoading
                &&
                <BarLoader
                    width={"100%"}
                    className='mt-4'
                    color='#9333ea' />

            }
            {/* filters */}
            <div className='flex flex-col sm:flew-row gap-4'>
                <div className='relative flex-1'>
                    <Search className='absolute left-2 top-2.5 h-4 w-4 to-muted-foreground' />
                    <Input
                        value={searchTerm}
                        placeholder='Search Transactions...'
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='pl-8' />
                </div>

                <div className='flex gap-2'>
                    <Select value={typeFilter} onValueChange={setTypefilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='INCOME'>Income</SelectItem>
                            <SelectItem value='EXPENSE'>Expense</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={recurringfilter} onValueChange={(v) => setRecurringFilter(v)}>
                        <SelectTrigger className='w-[140px]'>
                            <SelectValue placeholder="All Transactions" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='recurring'>Recurring Only</SelectItem>
                            <SelectItem value='non-recurring'>Non-recurring Only</SelectItem>
                        </SelectContent>
                    </Select>

                    {
                        selectedIds.length > 0
                        &&
                        <div>
                            <Button
                                className='flex items-center gap-2'
                                onClick={handleBulkDelete}
                                variant={"destructive"}
                                size={"sm"}>
                                <Trash className='h-4 w-4 mr-2' />
                                Selected ({selectedIds.length})
                            </Button>
                        </div>
                    }

                    {
                        (searchTerm || typeFilter || recurringfilter)
                        &&
                        <Button
                            onClick={handleClearFilters}
                            title='Clear filters'
                            size={"icon"}
                            variant={"outline"}>
                            <X className='h-4 w-5' />
                        </Button>
                    }
                </div>
            </div>

            {/* table */}
            <div className="">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {/* checkbox */}
                            <TableHead className='w-[50px]'>
                                <Checkbox
                                    checked={selectedIds.length === filteredAndSortedTransactions.length && filteredAndSortedTransactions.length > 0}
                                    onCheckedChange={handleSelectAll} />
                            </TableHead>
                            {/* date */}
                            <TableHead
                                onClick={() => handleSort("date")}
                                className='cursor-pointer'>
                                <div className="flex items-center">
                                    Date {
                                        sortingConfig.field === "date" &&
                                        (
                                            sortingConfig.direction === "asc"
                                                ?
                                                <ChevronUp className='ml-1 h-4 w-4' />
                                                :
                                                <ChevronDown className='ml-1 h-4 w-4' />
                                        )
                                    }
                                </div>
                            </TableHead>
                            {/* description */}
                            <TableHead>
                                Description
                            </TableHead>
                            {/* category */}
                            <TableHead
                                onClick={() => handleSort("category")}
                                className='cursor-pointer'>
                                <div className="flex items-center">Category {
                                    sortingConfig.field === "category" &&
                                    (
                                        sortingConfig.direction === "asc"
                                            ?
                                            <ChevronUp className='ml-1 h-4 w-4' />
                                            :
                                            <ChevronDown className='ml-1 h-4 w-4' />
                                    )
                                }</div>
                            </TableHead>
                            {/* amount */}
                            <TableHead
                                onClick={() => handleSort("amount")}
                                className='cursor-pointer'>
                                <div className="flex items-center justify-end">Amount {
                                    sortingConfig.field === "amount" &&
                                    (
                                        sortingConfig.direction === "asc"
                                            ?
                                            <ChevronUp className='ml-1 h-4 w-4' />
                                            :
                                            <ChevronDown className='ml-1 h-4 w-4' />
                                    )
                                }</div>
                            </TableHead>
                            {/* recurring */}
                            <TableHead>Recurring</TableHead>
                            {/* actions */}
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            filteredAndSortedTransactions.length === 0
                                ?
                                (<TableRow>
                                    <TableCell colSpan={7} className='text-center to-muted-foreground'>
                                        No Transaction Found
                                    </TableCell>
                                </TableRow>)
                                :
                                (
                                    filteredAndSortedTransactions.map(t => {
                                        return <TableRow key={t.id}>
                                            {/* checkbox */}
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedIds.includes(t.id)}
                                                    onCheckedChange={() => handleSelect(t.id)} />
                                            </TableCell>

                                            {/* date */}
                                            <TableCell>
                                                {format(new Date(t.date), "pp")}
                                            </TableCell>

                                            {/* desc */}
                                            <TableCell>
                                                <div className='text-muted-foreground text-sm'>{t.description}</div>
                                            </TableCell>

                                            {/* category */}
                                            <TableCell className='capitalize'>
                                                <span style={{
                                                    background: categoryColors[t.category]
                                                }}
                                                    className='px-2 py-1 rounded text-white text-sm'>
                                                    {t.category}
                                                </span>
                                            </TableCell>

                                            {/* amount */}
                                            <TableCell
                                                style={{
                                                    color: t.type === "EXPENSE" ? "red" : "green"
                                                }}
                                                className='text-right font-md'>
                                                {t.type === "EXPENSE" ? "-" : "+"}
                                                &#8377;{t.amount.toFixed(2)}
                                            </TableCell>

                                            {/* recurring */}
                                            <TableCell>
                                                {
                                                    t.isRecurring
                                                        ?
                                                        (
                                                            <TooltipProvider>
                                                                <TooltipTrigger>
                                                                    <Badge
                                                                        className='gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200'
                                                                        variant={"outline"}>
                                                                        <RefreshCw className='h-3 w-3 capitalize' />
                                                                        {t.recurringInterval}
                                                                    </Badge>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <div>
                                                                        Recurring Transaction
                                                                    </div>
                                                                </TooltipContent>
                                                            </TooltipProvider>
                                                        ) :
                                                        <Badge className='gap-1'
                                                            variant={"outline"}>
                                                            <Clock className='h-3 w-3' />
                                                            One-Time
                                                        </Badge>
                                                }
                                            </TableCell>

                                            {/* actions */}
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant={"ghost"} className='h-8 w-8 p-0'>
                                                            <MoreHorizontal className='h-4 w-4' />
                                                        </Button>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent>
                                                        <DropdownMenuLabel>Edit</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem onClick={() => router.push("/transaction/create?edit=" + t.id)}>Edit</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => deleteFn([t.id])} className='text-destructive'>Delete</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>

                                    })

                                )



                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default TransactionTable