import { Category } from './category.model.js';

export const getAllCategories = async (onlyActive = true) => {
  const filter = onlyActive ? { isActive: true } : {};
  return await Category.find(filter).sort({ label: 1 }).lean();
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