import { Link, useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem.jsx';
import { useCart } from '../hooks/useCart.js';

function Cart() {
  const { items, total } = useCart();
  const navigate = useNavigate();

  const handleProceedToBuy = () => {
    if (!items.length) return;
    navigate('/checkout');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h1 className="text-xl font-semibold mb-2">Shopping Cart</h1>
        <p className="text-xs text-gray-500 mb-4">Price</p>
        {items.length === 0 && (
          <div className="py-10 text-sm text-gray-700">
            <p>Your Amazon Clone Cart is empty.</p>
            <p className="mt-2">
              <Link to="/" className="text-blue-600 hover:text-blue-800">
                Continue shopping
              </Link>
            </p>
          </div>
        )}
        {items.map((item) => (
          <CartItem key={item.product_id} item={item} />
        ))}
        {items.length > 0 && (
          <div className="flex justify-end text-sm mt-4">
            <span>
              Subtotal ({items.length} item{items.length > 1 ? 's' : ''}):{' '}
              <span className="font-semibold">₹{total}</span>
            </span>
          </div>
        )}
      </section>

      <aside className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit">
        <p className="text-sm mb-2">
          Subtotal ({items.length} item{items.length > 1 ? 's' : ''}):{' '}
          <span className="font-semibold">₹{total}</span>
        </p>
        <button
          type="button"
          disabled={!items.length}
          onClick={handleProceedToBuy}
          className="w-full px-4 py-2 bg-amazon-yellow text-black text-sm font-medium rounded-md disabled:opacity-60 hover:bg-yellow-400 transition-colors"
        >
          Proceed to Buy
        </button>
      </aside>
    </div>
  );
}

export default Cart;

