import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(orderId));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    async function fetchOrder() {
      try {
        setLoading(true);
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data);
        setError(null);
      } catch (err) {
        setError('Unable to load order details.');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  if (!orderId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center bg-white mt-6 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-semibold text-red-700 mb-2">
          No order information found.
        </h1>
        <p className="text-sm text-gray-700 mb-6">
          We couldn&apos;t find an order to display. Please place a new order.
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-block px-6 py-2 bg-amazon-yellow text-black text-sm font-medium rounded-md hover:bg-yellow-400"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 bg-white mt-6 rounded-lg shadow-sm border border-gray-200">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-green-700 mb-1">
          Your order has been placed successfully.
        </h1>
        <p className="text-sm text-gray-700">
          Order ID: <span className="font-mono font-semibold">{orderId}</span>
        </p>
      </div>

      {loading && (
        <p className="text-sm text-gray-600 text-center">Loading order details...</p>
      )}

      {error && (
        <p className="text-sm text-red-600 text-center mb-4">{error}</p>
      )}

      {order && (
        <div className="grid grid-cols-1 md:grid-cols-[2fr,1.2fr] gap-6 text-sm">
          <section>
            <h2 className="text-base font-semibold mb-2 text-gray-900">
              Ordered products
            </h2>
            <div className="space-y-2 border border-gray-200 rounded-md p-3 max-h-72 overflow-y-auto">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-3 border-b border-gray-100 pb-2 last:border-b-0"
                >
                  <div className="flex-1">
                    <p className="text-gray-900 line-clamp-2">{item.name}</p>
                    <p className="text-xs text-gray-600">
                      Qty: {item.quantity} • ₹{item.price} each
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <aside className="space-y-3">
            <div className="border border-gray-200 rounded-md p-3">
              <h3 className="text-base font-semibold mb-2 text-gray-900">
                Order summary
              </h3>
              <p className="flex justify-between mb-1">
                <span>Total amount:</span>
                <span className="font-semibold">₹{order.total_amount}</span>
              </p>
              <p className="flex justify-between mb-1">
                <span>Items:</span>
                <span className="font-semibold">{order.items.length}</span>
              </p>
            </div>

            <div className="border border-gray-200 rounded-md p-3">
              <h3 className="text-base font-semibold mb-2 text-gray-900">
                Shipping address
              </h3>
              <p className="text-xs text-gray-700 whitespace-pre-line">
                {order.shipping_address}
              </p>
            </div>
          </aside>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Link
          to="/"
          className="inline-block px-6 py-2 bg-amazon-yellow text-black text-sm font-medium rounded-md hover:bg-yellow-400"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccess;

