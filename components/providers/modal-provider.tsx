'use client'
import React, { useEffect, useState } from 'react'
import SettingsModal from '../modal/SettingsModal'
import CoverImageModal from '../modal/CoverImageModal'

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <>
            <SettingsModal />
            <CoverImageModal />                         
        </>
    )
}

export default ModalProvider