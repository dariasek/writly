import Image from 'next/image'
import React from 'react'

export const Heroes = () => {
    return (
        <div className='flex flex-col items-center justify-center max-w-5xl' >
            <div className='flex items-center'>
                <div className='relative w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] md:h-[400px] md:w-[400px]'>
                    <Image
                        src='/docs.png'
                        alt='Documents Image'
                        className='object-contain dark:hidden'
                        fill
                    />
                    <Image
                        src='/docs-dark.png'
                        alt='Documents Image'
                        className='object-contain hidden dark:block'
                        fill
                    />
                </div>
                <div className='relative w-[400px] h-[400px] hidden md:block'>
                    <Image
                        src='/reading.png'
                        alt='Reading Image'
                        className='object-contain dark:hidden'
                        fill
                    />
                    <Image
                        src='/reading.png'
                        alt='Reading Image'
                        className='object-contain hidden dark:block'
                        fill
                    />
                </div>
            </div>
        </div>
    )
}