//[[...]] means we can add anything after the /signin. eg. /signin/abcd//
import React from 'react'
import { SignUp } from "@clerk/nextjs"

const Signin = () => {
    return (
        <div className='container mx-auto min-h-screen flex items-center justify-center'>
            <SignUp />
        </div>
    )
}

export default Signin