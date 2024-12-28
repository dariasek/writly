'use client'

import { Spinner } from "@/components/spinner"
import { useConvexAuth } from "convex/react"

const MainLayout = ({
    children
}: { children: React.ReactNode }) => {
    const { isLoading } = useConvexAuth()
    //TODO: fix dark mode issue
    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner size='lg' />
            </div>
        )
    }    

    return (
        <div className="h-full dark:bg-[#1F1F1F]">
            {children}
        </div>
    )
}

export default MainLayout