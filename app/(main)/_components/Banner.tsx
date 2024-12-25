'use client'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'
import ConfirmModal from './modals/ConfirmModal'

const Banner = ({
    documentId
}: { documentId: Id<'documents'> }) => {

    const router = useRouter()
    const remove = useMutation(api.documents.remove)
    const restore = useMutation(api.documents.restore)

    const onRemove = () => {
        const pr = remove({ documentId })

        toast.promise(pr, {
            loading: 'Deleting a note...',
            success: 'New deleted',
            error: 'Failed to delete a note'
        })
        router.push('/document')
    }

    const onRestore = () => {
        const pr = restore({ id: documentId })

        toast.promise(pr, {
            loading: 'Restoring a note...',
            success: 'New restored',
            error: 'Failed to restore a note'
        })
    }

    return (
        <div className='w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center'>
            Banner
            <p>
                This page is in the trash
            </p>
            <Button
             size='sm'
             onClick={onRestore}
             variant='outline'
             className='border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal'
            >
                Restore page
            </Button>
            <ConfirmModal onConfirm={onRemove}>
                <Button
                    size='sm'
                    variant='outline'
                    className='border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal'
                >
                    Delete forever
                </Button>
            </ConfirmModal>
            
        </div>
    )
}

export default Banner