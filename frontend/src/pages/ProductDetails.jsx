import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCart } from '../hooks/useCart.js';
import { api } from '../services/api.js';
import RatingStars from '../components/RatingStars.jsx';
import ImageCarousel from '../components/ImageCarousel.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useToast } from '../hooks/useToast.js';

const CATEGORY_LABELS = {
  1: 'Electronics',
  2: 'Clothing',
  3: 'Books',
  4: 'Home'
};

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const toast = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [related, setRelated] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        setError(null);
      } catch (err) {
        setError('Failed to load product.');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (!product?.category_id) return;

    async function fetchRelated() {
      try {
        setRelatedLoading(true);
        const res = await api.get('/products', {
          params: {
            category_id: product.category_id,
            limit: 4
          }
        });
        const others = (res.data?.data || []).filter(
          (p) => p.id !== product.id
        );
        setRelated(others);
      } catch {
        setRelated([]);
      } finally {
        setRelatedLoading(false);
      }
    }

    fetchRelated();
  }, [product]);

  const handleAddToCart = (redirectToCart = false) => {
    if (!product) return;
    const primaryImage =
      product.images?.[0]?.image_url || product.image_url || undefined;

    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image_url: primaryImage
    });

    toast.success('Added to cart');

    if (redirectToCart) {
      navigate('/cart');
    }
  };

  const handleBuyNow = () => {
    handleAddToCart(false);
    navigate('/checkout');
  };

  if (loading)
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr,1fr] gap-8 animate-pulse">
          <div className="h-80 bg-gray-200 rounded" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-5 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-10 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 text-red-600 text-sm">
        {error}
      </div>
    );

  if (!product)
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <p>Product not found.</p>
      </div>
    );

  const imageUrls = product.images?.length
    ? product.images.map((img) => img.image_url)
    : [product.image_url].filter(Boolean);

  const inStock = product.stock > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-[1.1fr,1.2fr,0.9fr] gap-8">
        <ImageCarousel images={imageUrls} />

        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-semibold mb-1 text-gray-900">
              {product.name}
            </h1>
            <RatingStars rating={product.rating} count={product.review_count} />
          </div>

          <div>
            <p className="text-2xl font-bold text-red-700">₹{product.price}</p>
          </div>

          {product.description && (
            <div>
              <h2 className="font-semibold mb-1 text-gray-900">About this item</h2>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          <div>
            <h2 className="font-semibold mb-1 text-gray-900">Specifications</h2>
            <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
              {product.category_id && (
                <li>Category: {CATEGORY_LABELS[product.category_id] || 'Other'}</li>
              )}
              <li>Rating: {product.rating ?? 'N/A'} / 5</li>
              <li>Reviews: {product.review_count ?? 0}</li>
              <li>Stock: {inStock ? `${product.stock} available` : 'Out of stock'}</li>
              <li>Product ID: {product.id}</li>
            </ul>
          </div>
        </div>

        <aside className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit space-y-3">
          <p className="text-2xl font-bold text-red-700">₹{product.price}</p>
          <p className={`text-sm font-semibold ${inStock ? 'text-green-700' : 'text-red-700'}`}>
            {inStock ? 'In stock' : 'Currently unavailable'}
          </p>
          <p className="text-xs text-gray-600">
            Sold by <span className="font-semibold">Amazon Clone</span> and fulfilled by
            Demo.
          </p>

          <div className="space-y-2">
            <button
              type="button"
              disabled={!inStock}
              onClick={() => handleAddToCart(true)}
              className="w-full px-6 py-2 rounded-full text-sm font-medium bg-amazon-yellow text-black hover:bg-yellow-400 disabled:opacity-60"
            >
              Add to Cart
            </button>
            <button
              type="button"
              disabled={!inStock}
              onClick={handleBuyNow}
              className="w-full px-6 py-2 rounded-full text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-60"
            >
              Buy Now
            </button>
          </div>
        </aside>
      </div>

      {/* Related products */}
      <section>
        <h2 className="text-lg font-semibold mb-3 text-gray-900">
          Related products
        </h2>
        {relatedLoading && (
          <p className="text-sm text-gray-600">Loading related products...</p>
        )}
        {!relatedLoading && related.length === 0 && (
          <p className="text-sm text-gray-600">No related products found.</p>
        )}
        {!relatedLoading && related.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ProductDetails;

