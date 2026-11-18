import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const SORT_FIELDS = new Set(['productName', 'sku', 'category', 'price', 'cost', 'stockQuantity', 'reorderLevel', 'lastUpdated']);

function parseBoundedInt(value, fallback, min, max, name) {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    const error = new Error(`${name} must be an integer between ${min} and ${max}.`);
    error.statusCode = 400;
    throw error;
  }
  return parsed;
}

function buildFilter(query) {
  const filter = {};
  if (query.category) filter.category = query.category;
  if (query.maxStock !== undefined) {
    const maxStock = Number(query.maxStock);
    if (!Number.isFinite(maxStock) || maxStock < 0) {
      const error = new Error('maxStock must be a non-negative number.');
      error.statusCode = 400;
      throw error;
    }
    filter.stockQuantity = { ...(filter.stockQuantity || {}), $lte: maxStock };
  }
  const minPrice = query.minPrice === undefined ? undefined : Number(query.minPrice);
  const maxPrice = query.maxPrice === undefined ? undefined : Number(query.maxPrice);
  if ((minPrice !== undefined && (!Number.isFinite(minPrice) || minPrice < 0)) ||
      (maxPrice !== undefined && (!Number.isFinite(maxPrice) || maxPrice < 0)) ||
      (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice)) {
    const error = new Error('Price range must contain valid non-negative values with minPrice <= maxPrice.');
    error.statusCode = 400;
    throw error;
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }
  if (query.search?.trim()) filter.$text = { $search: query.search.trim() };
  return filter;
}

export const getInventory = asyncHandler(async (req, res) => {
  const page = parseBoundedInt(req.query.page, 1, 1, 10000000, 'page');
  const limit = parseBoundedInt(req.query.limit, 50, 1, 1000, 'limit');
  const sortParam = String(req.query.sort || 'productName');
  const descending = sortParam.startsWith('-');
  const sortField = descending ? sortParam.slice(1) : sortParam;
  if (!SORT_FIELDS.has(sortField)) {
    const error = new Error('Unsupported sort field.');
    error.statusCode = 400;
    throw error;
  }
  const filter = buildFilter(req.query);
  const sort = { [sortField]: descending ? -1 : 1, _id: 1 };
  const skip = (page - 1) * limit;
  const [data, totalRecords] = await Promise.all([
    Product.find(filter).select('-__v').sort(sort).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);
  const totalPages = Math.ceil(totalRecords / limit);
  res.json({
    success: true,
    data,
    pagination: {
      totalRecords,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      limit,
    },
  });
});

export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Product.distinct('category');
  res.json({ success: true, data: categories.sort() });
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.validatedBody);
  res.status(201).json({ success: true, data: product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID.' });
  }
  const existing = await Product.findById(req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Product not found.' });
  const merged = { ...existing.toObject(), ...req.validatedBody };
  if (merged.price < merged.cost) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: [{ field: 'price', message: 'Price cannot be lower than cost.' }],
    });
  }
  Object.assign(existing, req.validatedBody, { lastUpdated: new Date() });
  await existing.save();
  res.json({ success: true, data: existing });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid product ID.' });
  }
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, message: 'Product not found.' });
  res.json({ success: true, message: 'Product deleted.' });
});
