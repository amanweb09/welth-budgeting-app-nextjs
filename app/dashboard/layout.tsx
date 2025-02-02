import React, { Suspense } from 'react'
import Dashboard from './page'
import { BarLoader } from "react-spinners"

const DashboardLayout = () => {
    return (
        <div className='px-5 pt-20 pb-4'>
            <h1 className='text-6xl font-semibold gradient-title mb-5'>Dashboard</h1>

            {/* if we are making an API call, this component will be in loading state */}
            <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='#9333ea'/>}>
                <Dashboard />
            </Suspense>
        </div>
    )
}

export default DashboardLayout
