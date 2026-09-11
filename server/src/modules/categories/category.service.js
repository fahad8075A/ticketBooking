import { Category } from './category.model.js';

export const getAllCategories = async (onlyActive = true) => {
  const filter = onlyActive ? { isActive: true } : {};
  return await Category.find(filter).sort({ createdAt: 1 }).lean();
};

export const getCategoryById = async (id) => {
  return await Category.findById(id).lean();
};

export const createCategory = async (data) => {
  return await Category.create(data);
};

export const updateCategory = async (id, updateData) => {
  return await Category.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

export const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};