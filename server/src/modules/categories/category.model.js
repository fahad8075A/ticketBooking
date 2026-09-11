import mongoose from 'mongoose';
import { CATEGORY_TYPES } from '../../constants/categories.js';

const categorySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Category code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      enum: CATEGORY_TYPES,
    },
    label: {
      type: String,
      required: [true, 'Category label is required'],
      trim: true,
    },
    iconName: {
      type: String,
      default: null,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const Category = mongoose.model('Category', categorySchema);