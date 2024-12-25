'use client'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { MenuIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'
import Title from './Title'
import Banner from './Banner'
import Menu from './Menu'

const Navbar = ({
    isCollapsed,
    onResetWidth
}: {
    isCollapsed: boolean,
    onResetWidth: () => void
}) => {
    const params = useParams()
    const document = useQuery(api.documents.getById, { id: params.documentId as Id<'documents'> })

    if (document === undefined) {
        return (
            <nav className='bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center justify-between w-full'>
                <Title.Skeleton />
                <div className='flex items-center gap-x-2'>
                    <Menu.Skeleton />

                </div>
            </nav>
        )
    }

    if (document === null) {
        return null
    }
    return (
        <>
            <nav className='bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4'>
                {
                    isCollapsed && <MenuIcon className='h-6 w-6 text-muted-foreground' role='button' onClick={onResetWidth} />
                }
                <div className='flex items-center justify-between w-full '>
                    <Title initialData={document} />
                    <div className='flex items-center gap-x-2'>
                        <Menu documentId={document._id} />
                    </div>
                </div>
            </nav>
            {document.isArchived && (<Banner documentId={document._id} />)}
        </>
    )
}

export default Navbar