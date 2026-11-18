import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getAnalytics = asyncHandler(async (_req, res) => {
  const [summaryRows, restockPriority, categoryValuation] = await Promise.all([
    Product.aggregate([
      {
        $group: {
          _id: null,
          totalSkus: { $sum: 1 },
          totalInventoryValue: { $sum: { $multiply: ['$price', '$stockQuantity'] } },
          outOfStockItems: { $sum: { $cond: [{ $eq: ['$stockQuantity', 0] }, 1, 0] } },
        },
      },
      { $project: { _id: 0, totalSkus: 1, totalInventoryValue: { $round: ['$totalInventoryValue', 2] }, outOfStockItems: 1 } },
    ]),
    Product.aggregate([
      { $match: { stockQuantity: { $gte: 0 } } },
      { $sort: { stockQuantity: 1, productName: 1 } },
      { $limit: 10 },
      { $project: { _id: 1, productName: 1, sku: 1, category: 1, stockQuantity: 1, reorderLevel: 1 } },
    ]),
    Product.aggregate([
      { $match: { stockQuantity: { $gt: 0 } } },
      {
        $group: {
          _id: '$category',
          totalValuation: { $sum: { $multiply: ['$price', '$stockQuantity'] } },
          skuCount: { $sum: 1 },
        },
      },
      { $project: { _id: 0, category: '$_id', totalValuation: { $round: ['$totalValuation', 2] }, skuCount: 1 } },
      { $sort: { totalValuation: -1 } },
    ]),
  ]);

  res.json({
    success: true,
    data: {
      summary: summaryRows[0] ?? { totalSkus: 0, totalInventoryValue: 0, outOfStockItems: 0 },
      restockPriority,
      categoryValuation,
    },
  });
});
