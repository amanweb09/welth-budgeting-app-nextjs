import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import Logo from './logo'
import { Button } from "./ui/button"
import { LayoutDashboard, PenBox } from 'lucide-react'
import { checkUser } from '@/lib/check-user'

// only server components can be made async
const Header = async () => {

  await checkUser()
  
  return (
    <div className='fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b'>

      <nav className='container mx-auto p-4 flex items-center justify-between'>
        <Link href={"/"}>
          <Logo />
        </Link>

        <div className='flex items-center space-x-4'>
          <SignedIn>
            <Link
              className='text-gray-600 hover:text-blue-600 flex items-center gap-2'
              href={"/dashboard"}>
              <Button variant={"outline"}>
                <LayoutDashboard size={18} />
                <span className='hidden md:inline'>Dashboard</span>
              </Button>
            </Link>
            <Link
              className='text-gray-600 hover:text-blue-600 flex items-center gap-2'
              href={"/transaction/create"}>
              <Button>
                <PenBox size={18} />
                <span className='hidden md:inline'>Add Transaction</span>
              </Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl={"/dashboard"}>
              <Button variant="outline">
                Login
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton 
            appearance={{ 
              elements: { 
                avatarBox: "w-10 h-10" }}} />
          </SignedIn>
        </div>
      </nav>

    </div>
  )
}

export default Header