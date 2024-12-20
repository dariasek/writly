'use client'

import { Spinner } from "@/components/spinner"
import { useConvexAuth } from "convex/react"
import { redirect } from "next/navigation"
import Navigation from "./_components/Navigation"
import { useState } from "react"
import { useMediaQuery } from "usehooks-ts"
import { cn } from "@/lib/utils"

const MainLayout = ({
    children
}: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useConvexAuth()
    // const isMobile = useMediaQuery('(max-width: 768px)')
    // const [isResetting, setIsResetting] = useState(false)
    
    // const [isNavigationCollapsed, setIsNavigationCollapsed] = useState(isMobile)

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner size='lg' />
            </div>
        )
    }

    if (!isAuthenticated) {
        return redirect('/')
    }

    

    return (
        <div className="h-full flex dark:bg-[#1F1F1F]">
            <Navigation
                // setIsNavigationCollapsed={setIsNavigationCollapsed} isMobile={isMobile} setIsResettingParent={setIsResetting}
            />
            {/*flex-1  overflow-y-auto */}
            <main className={cn(
                'flex-1 h-full overflow-hidden ',
                // 'transition-all ease-in-out duration-300',
                // isMobile && !isNavigationCollapsed && 'w-0',
            )}>
                {children}
            </main>
        </div>
    )
}

export default MainLayout