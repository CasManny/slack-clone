import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
    ...authTables,
    workspaces: defineTable({
        name: v.string(), // name of the workspace
        userId: v.id('users'), // user who created the space
        joinCode: v.string()
    })

})

export default schema