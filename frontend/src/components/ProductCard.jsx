import { Link } from 'react-router-dom';
import RatingStars from './RatingStars.jsx';
import { useCart } from '../hooks/useCart.js';
import { useToast } from '../hooks/useToast.js';

function ProductCard({ product }) {
  const { addItem } = useCart();
  const toast = useToast();

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url
    });
    toast.success('Added to cart');
  };

  return (
    <div className="z-20 flex h-full flex-col overflow-hidden bg-white p-4 pt-5 transition-shadow duration-200 hover:shadow-[0_0_10px_rgba(0,0,0,0.12)]">
      <Link to={`/product/${product.id}`} className="group flex flex-1 flex-col cursor-pointer">
        <div className="mb-3 flex h-52 w-full items-center justify-center bg-[#f7f8f8] p-4">
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-contain mix-blend-multiply"
          />
        </div>

        <div className="flex flex-1 flex-col text-sm">
          <h3 className="mb-1 line-clamp-3 leading-5 text-[#0F1111] group-hover:text-[#c45500]">
            {product.name}
          </h3>

          <div className="mb-1 flex items-center gap-1">
            <RatingStars
              rating={product.rating || 4.5}
              count={product.review_count || Math.floor(Math.random() * 500) + 50}
            />
            <span className="ml-1 cursor-pointer text-xs text-[#007185] hover:text-[#c45500] hover:underline">
              {product.review_count || Math.floor(Math.random() * 500) + 50}
            </span>
          </div>

          {product.id % 3 === 0 && (
            <div className="mb-1">
              <span className="rounded-[2px] bg-[#cc0c39] px-2 py-1 text-[11px] font-bold text-white">
                Limited time deal
              </span>
            </div>
          )}

          <div className="relative mb-1 mt-1 flex items-end">
            <span className="mr-0.5 mb-1 text-[12px] leading-none text-[#0F1111]">
              Rs.
            </span>
            <span className="text-[28px] font-medium leading-none text-[#0F1111]">
              {Math.floor(product.price).toLocaleString('en-IN')}
            </span>
            {product.price % 1 !== 0 && (
              <span className="ml-0.5 mb-1 text-[12px] leading-none text-[#0F1111]">
                {(product.price % 1).toFixed(2).substring(2)}
              </span>
            )}

            {product.id % 2 === 0 && (
              <span className="mb-1 ml-2 text-[12px] text-[#565959] line-through">
                Rs.
                {(product.price * 1.3).toLocaleString('en-IN', {
                  maximumFractionDigits: 0
                })}
              </span>
            )}
          </div>

          <div className="my-0.5 flex items-center">
            <span className="text-sm font-bold italic tracking-tighter text-[#00A8E1]">
              prime
            </span>
            <span className="ml-2 text-xs text-[#565959]">Get it by Tomorrow</span>
          </div>

          <div className="mb-2 text-xs text-[#565959]">
            FREE Delivery over Rs.499.
          </div>
        </div>
      </Link>

      <div className="mt-auto pt-2">
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full rounded-full border border-[#FCD200] bg-[#FFD814] py-2 text-xs shadow-[0_2px_5px_0_rgba(213,217,217,0.5)] transition-colors hover:border-[#F2C200] hover:bg-[#F7CA00] focus:outline-none focus:ring-2 focus:ring-[#008296] focus:ring-offset-1 sm:text-sm"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
