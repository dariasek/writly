import { v } from 'convex/values'

import { mutation, query } from './_generated/server'
import { Doc, Id } from './_generated/dataModel'

// TODO: Fix any
const getUserId = async (ctx: any) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
        throw new Error('Not authenticated')
    }

    return { userId: identity.subject }
}

export const archivate = mutation({
    args: {
        id: v.id('documents')
    },
    handler: async (ctx, args) => {
        const { userId } = await getUserId(ctx)
        const doc = await ctx.db.get(args.id)

        if (!doc) throw new Error('Document is not found')
        if (doc.userId !== userId) throw new Error('Unauthorized')

        const archivateChildren = async (documentId: Id<'documents'>) => {
            const children = await ctx.db.query('documents')
                .withIndex('by_user_parent', q => q.eq('userId', userId).eq('parentDocument', documentId))
                .collect()

            for (const child of children) {
                await ctx.db.patch(child._id, {
                    isArchived: true
                })

                await archivateChildren(child._id)
            }
        }

        const result = await ctx.db.patch(args.id, { isArchived: true})
        archivateChildren(args.id)

        return result
    }
})

export const restore = mutation({
    args: {
        id: v.id('documents')
    },
    handler: async (ctx, args) => {
        const { userId } = await getUserId(ctx)
        const doc = await ctx.db.get(args.id)

        if (!doc) throw new Error('Document is not found')
        if (doc.userId !== userId) throw new Error('Unauthorized')

        const restoreChildren = async (documentId: Id<'documents'>) => {
            const children = await ctx.db.query('documents')
                .withIndex('by_user_parent', q => q.eq('userId', userId).eq('parentDocument', documentId))
                .collect()

            for (const child of children) {
                await ctx.db.patch(child._id, {
                    isArchived: false
                })

                await restoreChildren(child._id)
            }
        }

        const patchedOptions: Partial<Doc<'documents'>> = {
            isArchived: false
        }


        if (doc.parentDocument) {
            const parent = await ctx.db.get(doc.parentDocument)
            if (parent?.isArchived) {
                patchedOptions.parentDocument = undefined
            }
        }

        const result = await ctx.db.patch(args.id, { isArchived: false})

        restoreChildren(args.id)

        return result
    }
})


export const getSidebar = query({
    args: {
        parentDocument: v.optional(v.id('documents'))
    },
    handler: async (ctx, args) => {
        const { userId } = await getUserId(ctx)
        const documents = await ctx.db
            .query('documents')
            .withIndex('by_user_parent', q =>   
                q
                    .eq('userId', userId)
                    .eq('parentDocument', args.parentDocument)
                )
            .filter(q => q.eq(q.field("isArchived"), false))
            .order('desc')
            .collect()

        return documents
    }
})

export const create = mutation({
    args: {
        title: v.string(),
        parentDocument: v.optional(v.id("documents"))
    }, 
    handler: async (ctx, args) => {
        const { userId } = await getUserId(ctx)

        const result = await ctx.db.insert('documents', {
            title: args.title,
            parentDocument: args.parentDocument,
            userId,
            isArchived: false,
            isPublished: false,            
        })

        return result
    }
})

export const getTrash = query({
    args: {},
    handler: async (ctx, args) => {
        const { userId } = await getUserId(ctx)

        const documents = await ctx.db.query('documents')
            .withIndex('by_user', q => q.eq('userId', userId))
            .filter(q => q.eq(q.field('isArchived'), true))
            .order('desc')
            .collect()

        return documents
    }
})

export const remove = mutation({
    args: {
        documentId: v.id('documents')
    },
    handler: async (ctx, args) => {
        const { userId } = await getUserId(ctx)

        const doc = await ctx.db.get(args.documentId)

        if (!doc) throw new Error('Document is not found')
        if (doc.userId !== userId) throw new Error('Unauthorized')

        const result = await ctx.db.delete(args.documentId)

        return result
    }
})

export const getSearch = query({
    handler: async (ctx) => {
        const { userId } = await getUserId(ctx)

        const result = await ctx.db
            .query('documents')
            .withIndex('by_user', q => q.eq('userId', userId))
            .filter(q => q.eq(q.field('isArchived'), false))
            .order('desc')
            .collect()

        return result
    }
})

export const getById = query({
    args: {
        id: v.id('documents')
    },
    async handler(ctx, args) {
        const { userId } = await getUserId(ctx)
        const document = await ctx.db.get(args.id)

        if (!document) {
            throw new Error('Not found')
        }

        if (document.isPublished && !document.isArchived) {
            return document
        }

        if (document.userId !== userId) {
            throw new Error('Unauthorized')
        } else {
            return document
        }
    }
})


export const update = mutation({
    args: {
        id: v.id('documents'),
        title: v.optional(v.string()),
        content: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        icon: v.optional(v.string()),
        isPublished: v.optional(v.boolean()),
    },
    async handler(ctx, args) {
        const { userId } = await getUserId(ctx)

        const { id, ...argsToUpdate } = args

        const document = await ctx.db.get(id)

        if (!document) {
            throw new Error('Not found')
        } 

        if (document.userId !== userId) {
            throw new Error('Unauthorized')
        }

        const documentUpdated = await ctx.db.patch(id, argsToUpdate)

        return documentUpdated
    }
})