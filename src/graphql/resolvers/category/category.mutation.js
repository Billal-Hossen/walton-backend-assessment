

import { categoryService } from '../../../modules/services'
export default {
  async addCategory(parent, args) {
    const { inputData = {} } = args
    return await categoryService.createAnCategory(inputData)
  },
  async updateCategory(parent, args) {
    const { inputData = {} } = args
    return await categoryService.updateCategoryService(inputData)
  },
  async deleteCategory(parent, args) {
    const { inputData = {} } = args
    return await categoryService.deleteCategoryAndSub(inputData)
  },
  async deactivateCategoryAndSub(parent, args) {
    const { inputData = {} } = args
    return await categoryService.deactivateCategoryService(inputData)
  },
}