"use client"
import { useScrollTop } from '@/hooks/use-scroll-top'
import { cn } from '@/lib/utils'
import React from 'react'
import Logo from './logo'
import { ModeToggle } from '@/components/ui/theme-toggle'
import { useConvexAuth } from 'convex/react'
import { SignInButton, UserButton } from '@clerk/clerk-react'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/spinner'
import Link from 'next/link'

const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const scrolled = useScrollTop()
  return (
    <div className={cn('z-50 bg-background  dark:bg-[#1F1F1F] fixed top-0 items-center w-full p-6 flex', scrolled && 'border-b shadow-sm')}>
      <Logo />
      <div className='md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2'>
        {
          isLoading && <Spinner />
        }
        {
          !isAuthenticated && !isLoading && (
            <>
              <SignInButton mode='modal'>
                <Button variant='ghost' size='sm'>
                  Log in
                </Button>
              </SignInButton>
              <SignInButton mode='modal'>
                <Button size='sm'>
                  Get Writly for free
                </Button>
              </SignInButton>
            </>

          )
        }
        {
          isAuthenticated && !isLoading && (
            <>
              <Button variant='ghost' size='sm' asChild>
                <Link href='/document'>
                  Enter Writly
                </Link>
              </Button>
              <UserButton />
            </>
          )
        }
        <ModeToggle />
      </div>
    </div>
  )
}

export default Navbar