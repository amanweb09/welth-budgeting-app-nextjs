import { PrismaClient } from "@prisma/client"

// ensures prisma client does not initialize again everytime app reloads
export const db = globalThis.prisma || new PrismaClient()

if(process.env.NODE_ENV == "production") {
    globalThis.prisma = db
}

