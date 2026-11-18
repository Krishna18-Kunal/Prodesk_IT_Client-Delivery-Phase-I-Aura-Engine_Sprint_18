import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true, trim: true, maxlength: 180 },
  sku: { type: String, required: true, unique: true, trim: true, uppercase: true },
  category: { type: String, required: true, trim: true, index: true },
  price: { type: Number, required: true, min: 0 },
  cost: { type: Number, required: true, min: 0 },
  stockQuantity: { type: Number, required: true, min: 0, validate: Number.isInteger },
  reorderLevel: { type: Number, required: true, min: 0, validate: Number.isInteger },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true, versionKey: false });

productSchema.index({ sku: 1 }, { unique: true });
productSchema.index({ category: 1 });
productSchema.index({ productName: 1 });
productSchema.index({ productName: 'text', sku: 'text', category: 'text' }, {
  weights: { productName: 5, sku: 3, category: 1 },
  name: 'inventory_search_text',
});

export default mongoose.model('Product', productSchema);
