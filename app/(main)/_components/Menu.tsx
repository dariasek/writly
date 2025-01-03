'use client'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useUser } from '@clerk/clerk-react'
import { useMutation } from 'convex/react'
import { MoreHorizontal, Trash } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

const Menu = ({
    documentId
}: {
    documentId: Id<'documents'>
}) => {
    const { user } = useUser()


    const archive = useMutation(api.documents.archivate)

    const onArchive = () => {
        const pr = archive({ id: documentId })

        toast.promise(pr, {
            loading: 'Moving to trash...',
            success: 'Note moved to trash',
            error: 'Failed to archive the note'
        })
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size='sm'
                    variant='ghost'
                >
                    <MoreHorizontal className='h-4 w-4' />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-60 ' align='end' alignOffset={8} forceMount>
                <DropdownMenuItem onClick={onArchive}>
                    <Trash className='w-4 h-4 mr-2' />
                    Delete
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className='text-xs text-muted-foreground p-2'>
                    Last edited by: {user?.fullName}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

Menu.Skeleton = function MenuSkeleton() {
    return (<Skeleton className='h-10 w-10' />)
}

export default Menu