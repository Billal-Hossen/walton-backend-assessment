const { Schema, model } = require('mongoose')
export const Id = new Schema({
    _id: {
        type: String,
        immutable: true
    }
})
const categorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    active: { type: Boolean, default: true }
}, { timestamps: true })


export const categoriesCollection = model('categories', categorySchema);

