import { ApolloServer } from '@apollo/server'
import { unwrapResolverError } from '@apollo/server/errors'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { head, size } from 'lodash'

import { protectDirective } from 'src/graphql/protectDirectives/protectDirective'
import resolvers from 'src/graphql/resolvers'
import typeDefs from 'src/graphql/schema'

const { protectDirectiveTransformer } = protectDirective()

const GQLServer = new ApolloServer({
    formatError: (formattedError, error) => {
        const originalError = unwrapResolverError(error)
        const exception = {
            ...(typeof originalError === 'object' ? originalError : null)
        }

        if (process.env.IS_OFFLINE) {
            console.log(`+++ Checking exception of ${head(formattedError?.path)}:`, exception, '+++')
            console.log(`--- Checking GraphQL formatted error of ${head(formattedError?.path)}:`, formattedError, '---')
        }

        if (size(exception)) {
            return {
                message: exception.message || 'INTERNAL SERVER ERROR',
                statusCode: exception.statusCode || 500
            }
        }

        return formattedError
    },
    introspection: process.env.ENVIRONMENT !== 'production', // !!process.env.IS_OFFLINE
    schema: protectDirectiveTransformer(makeExecutableSchema({ resolvers, typeDefs }))
})

export { GQLServer }
