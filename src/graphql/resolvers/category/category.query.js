import { categoryHelper } from 'src/modules/helpers'
export default {
    async categories(parent, args) {
        const { queryData } = args || {}
        const categories = await categoryHelper.getCategoryController(queryData)
        return {
            data: categories
        }
    }
}