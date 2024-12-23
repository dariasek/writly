"use client"

import { useUser } from '@clerk/clerk-react'
import { useQuery } from 'convex/react'
import { File } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { KeyboardEvent, useEffect, useState } from 'react'
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from './ui/command'
import { useSearch } from '@/hooks/use-search'
import { api } from '@/convex/_generated/api'

const SearchCommand = () => {
    const { user } = useUser()
    const router = useRouter()
    const documents = useQuery(api.documents.getSearch)
    const [isMounted, setIsMounted] = useState(false)

    const toggle = useSearch(store => store.toggle)
    const isOpen = useSearch(store => store.isOpen)
    const onClose = useSearch(store => store.onClose)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            e.preventDefault()

            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                toggle()
            }
        }

        document.addEventListener('keydown', down)
        return () => {
            document.removeEventListener('keydown', down)
        }
    }, [toggle])
    
    // TODO: double check hydration error
    if (!isMounted) {
        return null
    }

    const onSelect = (id: string) => {
        router.push(`/document/${id}`)
        onClose()
    }

    return (
        <CommandDialog open={isOpen} onOpenChange={onClose} >
            <CommandInput />
            <CommandList placeholder={`Search ${user?.fullName}'s Writly...`} >
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading='Documents'>
                    {
                        documents?.map(document => (
                            <CommandItem
                                key={document._id}
                                value={`${document._id}-${document.title}`}
                                title={document.title}
                                onSelect={onSelect}
                            >
                                {
                                    document.icon
                                        ? (<p className='mr-2 text-[18px]'>
                                            {document.icon}
                                        </p>)
                                        : <File className='mr-2 h-4 w-4' />
                                }
                                <span>{document.title}</span>
                            </CommandItem>
                        ))
                    }
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}

export default SearchCommand