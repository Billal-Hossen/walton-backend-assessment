import { Router } from "express";
import { GQLServer } from "../graphql/server.js";
import { expressMiddleware } from "@apollo/server/express4";

const router = Router()

GQLServer.start().then(() => {
    router.use(
        '/graphql',
        expressMiddleware(GQLServer, {
            context: ({ req }) => ({ user: req?.user || {} })
        }))
})
export default router