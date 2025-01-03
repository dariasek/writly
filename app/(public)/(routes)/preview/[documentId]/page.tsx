'use client'
import Cover from '@/components/Cover'
import Toolbar from '@/components/toolbar'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import React, { useMemo } from 'react'


const DocumentPage = () => {
    const params = useParams()
    const document = useQuery(api.documents.getById, {
        id: params.documentId as Id<'documents'>
    })

    const Editor = useMemo(() => dynamic(() => import('@/components/Editor'), { ssr: false }), [])

    if (document === undefined) {
        return <div>
            <Cover.Skeleton />
            <div className='md:max-w-3xl lg:max-w-4xl mx-auto mt-10'>
                <div className='space-y-4 pl-8 pt-4'>
                    <Skeleton className='h-14 w-[50%]' />
                    <Skeleton className='h-4 w-[80%]' />
                    <Skeleton className='h-4 w-[40%]' />
                    <Skeleton className='h-4 w-[60%]' />
                </div>
            </div>
        </div>
    }

    if (document === null) {
        return <div>
            Not found
        </div>
    }

    return (
        <div className='pb-40'>
            <Cover url={document.coverImage} preview />
            <div className='md:max-w-3xl lg:max-w-4xl mx-auto'>
                <Toolbar initialData={document} preview />
                <Editor
                    editable={false}
                    onChange={() => {}}
                    initialContent={document.content}
                />
            </div>
        </div>
    )
}

export default DocumentPage