import { categoriesCollection } from 'src/graphql/resolvers/category/category.model'
import { CustomError } from '../common/error'

export const getCategoryController = async (queryData) => {
    const { categoryId } = queryData
    let categories = await getCategoryService(categoryId)
    if (categories.length === 0) {
        categories = [await getAnCategory(categoryId)]
    }

    if (!categories[0]) {
        throw new CustomError(404, 'Category not found!')
    }
    return categories
}


const getCategoryService = async (categoryId) => {
    let categories
    if (categoryId) {
        categories = await categoriesCollection.find({ parentId: categoryId })
    } else {
        categories = await categoriesCollection.find({ parentId: null })
    }
    return categories
}

export const getAnCategory = async (_id) => await categoriesCollection.findById(_id)


export const checkDuplicateName = async (name) => {
    const existName = await categoriesCollection.findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') }, // 'i' flag for case-insensitive search
    });
    return existName !== null;
}