# SHADCN UI
    * npx shadcn init
    * npx shadcn add button card

# CLERK
    * create account

# NextJS
[auth] - ignore the folder name while creating a route
eg. [auth]/signin will be accessed as /signin and not /auth/signin
Server actions: logic to handle API calls

Inngest - cron jobs & scheduling

# Prisma
    * pushing models
    npx prisma migrate dev --name create-models

    * generate interfaces from schema
    npx prisma generate
    import {Account} from prisma/prisma-client