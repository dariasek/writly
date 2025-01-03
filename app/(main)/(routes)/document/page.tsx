'use client'
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/clerk-react'
import { useMutation } from 'convex/react'
import { PlusCircle } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

const DocumentsPage = () => {
  const { user } = useUser()
  
  const router = useRouter()
  const create = useMutation(api.documents.create)
  const onCreate = () => {
    const pr = create({ title: 'untitled  '})
      .then(documentId => router.push(`/document/${documentId}`))

    toast.promise(pr, {
      loading: 'Creating a new note...',
      success: 'New note created',
      error: 'Failed to create a new note'
    })
  }

  return (
    <div className='h-full flex flex-col items-center justify-center space-y-4'>
      {/* Text */}
      <Image height={300} width={300} src={'/empty.svg'} alt='typewriter image' />
      <h2 className='text-lg font-medium'>
        Welcome to {user?.firstName}&apos;s Writly
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className='h-4 w-4 mr-2' />
        Create a note
      </Button>
    </div>
  )
}

export default DocumentsPage