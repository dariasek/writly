'use client'
import Toolbar from '@/components/toolbar'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { useParams } from 'next/navigation'
import React from 'react'

interface DocumentPageProps {
  params: {
    documentId: Id<'documents'>
  }
}

const DocumentPage = () => {
  const params = useParams()
  const document = useQuery(api.documents.getById, {
    id: params.documentId as Id<'documents'>
  })

  if (document === undefined) {
    return <div>
      Loading...
    </div>
  }

  if (document === null ) {
    return <div>
      Not found
    </div>
  }

  return (
    <div className='pb-40'>
      <div className='h-[35vh]' />
      <div className='md:max-w-3xl lg:max-w-4xl mx-auto'>
        <Toolbar initialData={document} />
      </div>
    </div>
  )
}

export default DocumentPage