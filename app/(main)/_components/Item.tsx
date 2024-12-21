import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { useMutation } from 'convex/react'
import { ChevronDown, ChevronRight, LucideIcon, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { MouseEvent } from 'react'
import { toast } from 'sonner'

interface ItemProps {
    id?: Id<'documents'>,
    active?: boolean,
    documentIcon?: string,
    expanded?: boolean,
    isSearch?: boolean,
    level?: number,
    onExpand?: () => void,
    onClick: () => void,
    label: string,
    icon: LucideIcon
}

// TODO: separeate elements SEARCh ? DOCITEM etc
const Item = ({
    active,
    expanded,
    isSearch,
    documentIcon,
    level = 0,
    onExpand,
    id,
    onClick,
    label,
    icon: Icon
}: ItemProps) => {
    const create = useMutation(api.documents.create)
    const router = useRouter()

    const ChevronIcon = expanded ? ChevronDown: ChevronRight

    const handleExpand = (event: MouseEvent) => {
        event.stopPropagation()
        onExpand?.()
    }

    const onCreate = (event: MouseEvent) => {
        event.stopPropagation()
        if (!id) return

        const pr = create({
            title: 'Untitled',
            parentDocument: id
        }).then((res) => {
            if (!expanded) {
                onExpand?.()
            }

            router.push(`/documents/${res}`)
        })

        toast.promise(pr, {
            loading: 'Creating a new note...',
            success: 'New note created',
            error: 'Failed to create a new note'
        })
    }

    return (
        <div
        onClick={onClick}
        role='button'
        className={cn(
            'group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium',
            active && 'bg-primary/5 text-primary'
        )}
        style={{ paddingLeft: level ? `${level * 12 + 12}px` : '12px' }}
    >
        {!!id && (
            <div 
                role='button'
                className='h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1'
                onClick={handleExpand}
            >
                <ChevronIcon className='h-4 w-4 shrink-0 text-muted-foreground' />
            </div>
        )}
        {
            documentIcon
                ? (<div className='shrink-0 mr-2 text-[18px]'>{documentIcon}</div>)
                : <Icon className='shrink-0 h-[18px] mr-2 text-muted-foreground ' />
        }
        <span className='truncate'>
            {label}
        </span>
        {
            isSearch && (
                <kbd className='ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground'>
                    <span className='text-xs'>CNTR</span>K
                </kbd>
            )
        }
        {!!id && (
            <div className='ml-auto flex items-center gap-x-2'>
                <div
                    className='opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:bg-neutral-600'
                    role='button'
                    onClick={onCreate}
                >
                    <Plus className='h-4 w-4 text-muted-foreground' />
                </div>
            </div>
        )}
    </div>
  )
}

Item.Skeleton = function ItemSceleton({level}: {level?: number}) {

    return (<div
        style={{
            paddingLeft: level ? `${12 * level + 25}px` : '12px'
        }}
        className='flex gap-x-2 py-[3px]'
    >
        <Skeleton className='h-4 w-4' />
        <Skeleton className='h-4 w-[30%]' />

    </div>)
}

export default Item
