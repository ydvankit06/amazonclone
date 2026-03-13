import {
  getProducts,
  getProductByIdWithImages,
  searchProductsByName
} from '../models/productModel.js';

export async function listProducts(req, res, next) {
  try {
    const { page, limit, category_id } = req.query;
    const result = await getProducts({
      page,
      limit,
      categoryId: category_id
    });
    res.json({
      data: result.items,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await getProductByIdWithImages(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function searchProducts(req, res, next) {
  try {
    const { q } = req.query;
    const products = await searchProductsByName(q);
    res.json(products);
  } catch (err) {
    next(err);
  }
}

