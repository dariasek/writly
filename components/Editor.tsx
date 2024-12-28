'use client'
import React from 'react'
import {
    BlockNoteEditor,
    PartialBlock
} from '@blocknote/core'
import { useCreateBlockNote} from '@blocknote/react'
 import '@blocknote/core/style.css'
import { useTheme } from 'next-themes'
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEdgeStore } from '@/lib/edgestore'

const Editor = ({
    onChange,
    initialContent,
    editable
}: {
    onChange: (value: string) => void,
    initialContent?: string,
    editable?: boolean
}) => {
    const { resolvedTheme } = useTheme()
    const { edgestore } = useEdgeStore()
    const handleUpload = async (file: File) => {
        const resp = await edgestore.publicFiles.upload({
          file
        })
    
        return resp.url
      }

    const editor: BlockNoteEditor = useCreateBlockNote({
        initialContent: initialContent ? JSON.parse(initialContent) as PartialBlock[] : undefined,
        uploadFile: handleUpload
    })

    return (
        <div>
            <BlockNoteView
                editor={editor}
                theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
                onChange={() => onChange(JSON.stringify(editor.document, null, 2))}
                // sideMenu={false}
                editable={editable}
                
            ></BlockNoteView>
        </div>
    )
}

export default Editor