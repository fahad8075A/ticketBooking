import * as categoryService from './category.service.js';

export const getCategories = async (req, res, next) => {
  try {
    const onlyActive = req.query.includeInactive !== 'true';
    const categories = await categoryService.getAllCategories(onlyActive);

    return res.status(200).json({
      success: true,
      message: 'Categories fetched successfully',
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const newCategory = await categoryService.createCategory(req.body);

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const updated = await categoryService.updateCategory(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const deleted = await categoryService.deleteCategory(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};