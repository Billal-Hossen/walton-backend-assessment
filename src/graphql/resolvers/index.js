// // Mutations
import { default as categoryMutation } from './category/category.mutation.js'

// // Queries
import { default as categoryQuery } from './category/category.query'

export default {
    Mutation: {
        ...categoryMutation
    },
    Query: {
        ...categoryQuery
    }
}