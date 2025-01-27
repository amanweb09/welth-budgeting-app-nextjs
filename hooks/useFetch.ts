import { useState } from "react"
import { toast } from "sonner"

const useFetch = (cb: (...args: any) => any) => {
    const [data, setData] = useState(undefined)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<any | null>(null)
    const [closeDrawer, setCloseDrawer] = useState(false)

    const fn = async (...args: any) => {
        setLoading(true)
        setError(null)

        try {
            const response = await cb(...args)
            setData(response)
            setError(null)
            setCloseDrawer(true)
            toast.success("Account created successfully")
        } catch (error: any) {
            console.log(error)
            setError(error)
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return { data, loading, error, fn, setData, closeDrawer }
}

export default useFetch