import { Router } from 'express';
import {
  getInventory, getCategories, createProduct, updateProduct, deleteProduct,
} from '../controllers/inventoryController.js';
import { validateProduct } from '../middleware/validateProduct.js';

const router = Router();
router.get('/', getInventory);
router.get('/categories', getCategories);
router.post('/', validateProduct('create'), createProduct);
router.put('/:id', validateProduct('update'), updateProduct);
router.delete('/:id', deleteProduct);
export default router;
