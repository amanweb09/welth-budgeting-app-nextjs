"use client";

import { scanReceipt } from '@/app/actions/transaction'
import { Button } from '@/components/ui/button'
import useFetch from '@/hooks/useFetch'
import { Camera, Loader2 } from 'lucide-react'
import React, { useEffect, useRef } from 'react'
import { toast } from 'sonner';

const ReceiptScanner = ({ onScanComplete }: { onScanComplete: (scannedData: any) => any }) => {

    const fileInputRef = useRef<HTMLInputElement>(null)

    const {
        fn: scanReceiptFn,
        loading: scanReceiptLoading,
        error,
        closeDrawer: isSuccessful,
        data: scannedData
    } = useFetch(scanReceipt)

    const handleReceiptScan = async (file: File) => {
        if(file.size > 5*1024*1024){
            toast.error("File size should be less than 5mb")
            return;
        }

        await scanReceiptFn(file)
    }

    useEffect(() => {
        if(isSuccessful) {
            onScanComplete(scannedData)
            toast.success("Receipt scanned successfully!")
        }
    }, [isSuccessful])

    useEffect(() => {
        if(error) {
            console.log(error);
            toast.error(error.message || "Couldn't scan receipt")
        }
    }, [error])

    return (
        <div>
            <input
                className='hidden'
                accept='image/'
                capture="environment"
                ref={fileInputRef}
                type="file"
                onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleReceiptScan(file)
                }} />
            <Button
                type='button'
                variant={"outline"}
                onClick={() => fileInputRef.current?.click()}
                disabled={scanReceiptLoading}
                className='w-full h-10 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 animate-graident hover:opacity-90 transition-opacity text-white'>
                {
                    scanReceiptLoading
                        ?
                        <>
                            <Loader2 className='mr-2 animate-spin' />
                            <span>Scanning Recipt...</span>
                        </>
                        :
                        <>
                            {""}
                            <Camera className='mr-2' />
                            <span>Scan Receipt with AI</span>
                        </>
                }
            </Button>
        </div>
    )
}

export default ReceiptScanner