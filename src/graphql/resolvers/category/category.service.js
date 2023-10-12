import { difference, size } from 'lodash'

import { CustomError } from '../common/error'
import { checkDuplicateName, getAnCategory } from "./category.helper"
import { categoriesCollection } from 'src/graphql/resolvers/category/category.model'

// Create Category
export const createAnCategory = async (inputData) => {
  checkRequiredFields(['name'], inputData)
  const { name } = inputData

  if (!name) {
    throw new CustomError(404, 'name is required field')
  }

  if (await checkDuplicateName(name)) {
    throw new CustomError(409, `Name of ${name} category already exist`)
  } else {
    const category = new categoriesCollection(inputData);
    const newCategory = await category.save()
    if (!size(newCategory)) {
      throw new CustomError(404, `Unable to create an category`)
    }
    return newCategory
  }
}

// Update category and also their sub category
export const updateCategoryService = async (data) => {
  let { categoryId = '', active, name, parentId } = data
  checkRequiredFields(['categoryId'], data)
  let category
  const updateData = {
    active,
    name,
    parentId
  }
  if (active === true) {
    category = await categoriesCollection.findOneAndUpdate({ _id: categoryId }, updateData)
    parentId = categoryId
    await activateSubcategory(parentId)
  } else {
    category = await categoriesCollection.findOne({ _id: categoryId })
    category.active = false
    category.name = name ? name : category.name
    category.parentId = parentId ? parentId : category.parentId
    await category.save()
    parentId = categoryId
    await deactivateSubcategory(parentId)
  }
  if (!category) {
    throw new CustomError(404, 'Category not found')
  }
  const modifiedCategory = await getAnCategory(categoryId)
  return `Category ${modifiedCategory?.name} and it's sub categories updated`

}


// Delete category and also their sub category
export const deleteCategoryAndSub = async (inputData) => {
  const { categoryId } = inputData
  checkRequiredFields(['categoryId'], inputData)
  if (!categoryId) {
    throw new CustomError(404, 'CategoryId Missing')
  }
  const parentId = categoryId
  let queue = [await categoriesCollection.findById(parentId)]
  if (queue[0] === null) {
    throw new CustomError(404, 'Category Not Found!')
  }
  while (queue.length) {
    const category = queue.pop()
    const subCategories = await categoriesCollection.find({ parentId: category?._id })
    if (subCategories) queue = [...queue, ...subCategories]
    const value = await category?.deleteOne()

  }
  if (!queue?.length) {
    return 'Category and under their sub categories are deleted '
  }
}


// Deactivate category and also their sub category
export const deactivateCategoryService = async (inputData) => {
  const { categoryId } = inputData
  checkRequiredFields(['categoryId'], inputData)
  if (!categoryId) {
    throw new CustomError(404, 'CategoryId Missing')
  }
  const parentId = categoryId
  const category = await categoriesCollection.findOne({ _id: parentId })
  if (!category) {
    throw new CustomError(404, 'Category Not Found!')
  }
  category.active = false
  await category.save()
  await deactivateSubcategory(parentId)
  if (!category) {
    return 'Cactegory not found for update'
  }
  const updateCategory = await getAnCategory(categoryId)

  return ` Category ${updateCategory?.name} and it's sub categories deactivated`
}

const activateSubcategory = async (parentId) => {
  const subCategories = await categoriesCollection.find({ parentId })
  for (const subCategory of subCategories) {
    // Activate the sub category
    subCategory.active = true;
    await subCategory.save();

    // Recursively activate it's sub category
    await activateSubcategory(subCategory._id);
  }
}

const deactivateSubcategory = async (parentId) => {
  const subCategories = await categoriesCollection.find({ parentId })
  for (const subCategory of subCategories) {
    // Deactivate the sub category
    subCategory.active = false;
    await subCategory.save();

    // Recursively deactivate it's sub category
    await deactivateSubcategory(subCategory._id);
  }
}

const checkRequiredFields = (requiredFields = [], data = {}) => {
  const missingFields = difference(requiredFields, Object.keys(data))
  if (size(missingFields)) {

    throw new CustomError(400, `Missing ${missingFields}`)
  }
}