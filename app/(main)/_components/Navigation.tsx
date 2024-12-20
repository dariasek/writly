import { cn } from '@/lib/utils';
import { ChevronLeft, MenuIcon } from 'lucide-react'
import { usePathname } from 'next/navigation';
import React, { MouseEvent, useEffect, useRef, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts';
import UserItem from './UserItem';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const Navigation = (
    //     {
    //     setIsNavigationCollapsed,
    //     setIsResettingParent,
    //     isMobile
    // }: {
    //     setIsNavigationCollapsed: React.Dispatch<boolean>,
    //     setIsResettingParent: React.Dispatch<boolean>, 
    //     isMobile: boolean
    // }
) => {
    const pathname = usePathname()

    const isMobile = useMediaQuery('(max-width: 768px)')
    const isResizingRef = useRef(false);
    const sidebarRef = useRef<HTMLElement>(null)
    const navbarRef = useRef<HTMLDivElement>(null)
    const [isResetting, setIsResetting] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(isMobile)

    const documents = useQuery(api.documents.get)

    useEffect(() => {
        if (isMobile) {
            collapse()
        } else {
            resetWidth()
        }
    }, [isMobile])

    useEffect(() => {
        if (isMobile) {
            collapse()
        }
    }, [isMobile, pathname])

    // useEffect(() => {
    //     setIsNavigationCollapsed(isCollapsed)
    // }, [isCollapsed, setIsNavigationCollapsed])

    // useEffect(() => {
    //     setIsResettingParent(isResetting)
    // }, [isResetting, setIsResettingParent])


    const handleMouseMove = (e: MouseEvent) => {
        // will it work if rerendering happens?
        if (!isResizingRef.current) return

        const newWidth = e.clientX < 240 ? 240 : e.clientX > 480 ? 480 : e.clientX

        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = `${newWidth}px`
            navbarRef.current.style.setProperty('left', `${newWidth}px`)
            navbarRef.current.style.setProperty('width', `calc(100% - ${newWidth}px)`)
        }

    }

    const handleMouseUp = () => {
        isResizingRef.current = false

        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()

        isResizingRef.current = true
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }

    const resetWidth = () => {
        if (!sidebarRef.current || !navbarRef.current) return

        setIsCollapsed(false)
        setIsResetting(true)

        sidebarRef.current.style.width = isMobile ? '100%' : '240px'
        navbarRef.current.style.setProperty('width', isMobile ? '0' : 'calc(100% -240px)')
        navbarRef.current.style.setProperty('left', isMobile ? '100%' : '240px')

        setTimeout(() => {
            setIsResetting(false)
        }, 300);
    }


    const collapse = () => {
        if (!sidebarRef.current || !navbarRef.current) return

        setIsCollapsed(true)
        setIsResetting(true)

        sidebarRef.current.style.width = '0'
        navbarRef.current.style.setProperty('width', '100%')
        navbarRef.current.style.setProperty('left', '0')

        setTimeout(() => {
            setIsResetting(false)
        }, 300);
    }

    return (
        <>
            {/* overflow-y-auto  */}
            <aside
                ref={sidebarRef}
                className={cn(
                    'group/sidebar h-full bg-secondary flex flex-col w-60 relative z-[3000]',
                    isResetting && 'transition-all ease-in-out duration-300',
                    // isMobile && 'w-0'
                    isCollapsed && 'hidden overflow-hidden'
                )}>
                <div
                    role='button'
                    className={cn(
                        'h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-500 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition',
                        isMobile && 'opacity-100'
                    )}
                    onClick={collapse}>
                    <ChevronLeft className='h-6 w-6' />
                </div>
                <div>
                    <UserItem />
                </div>
                <div className='m-4'>
                    {documents?.map((document) => (
                        <p key={document._id}>{document.title}</p> 
                    ))}
                    {/* <p>Documents</p> */}
                </div>
                <div
                    onMouseDown={handleMouseDown}
                    onClick={resetWidth}
                    className='opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0' />
            </aside>
            <div
                ref={navbarRef}
                className={cn(
                    'absolute top-0 z-[9999] left-60 w-[calc(100%-240px)]',
                    isResetting && 'transition-all ease-in-out duration-300',
                    isMobile && 'left-0 w-full overflow-hidden'
                )}
            >
                <nav className='bg-transparent px-3 py-2 w-full'>
                    {isCollapsed && <MenuIcon onClick={resetWidth} role='button' className='h-6 w-6 text-muted-foreground' />}
                </nav>
            </div>
        </>
    )
}

export default Navigation