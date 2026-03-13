import { useCart } from '../hooks/useCart.js';
import { useToast } from '../hooks/useToast.js';

function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();
  const toast = useToast();

  const handleQuantityChange = (value) => {
    updateQuantity(item.product_id, Number(value));
    toast.info('Updated quantity');
  };

  const handleRemove = () => {
    removeItem(item.product_id);
    toast.info('Removed from cart');
  };

  return (
    <div className="flex gap-4 py-4 border-b border-gray-200">
      <div className="w-24 flex items-center justify-center">
        <img
          src={item.image_url}
          alt={item.name}
          loading="lazy"
          className="max-h-24 object-contain"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-sm">{item.name}</h3>
        <p className="mt-1 text-lg font-semibold">₹{item.price}</p>
        <div className="mt-2 flex items-center gap-3 text-sm">
          <label className="flex items-center gap-1">
            <span>Qty:</span>
            <select
              value={item.quantity}
              onChange={(e) => handleQuantityChange(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={handleRemove}
            className="text-blue-600 hover:text-blue-800"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;

