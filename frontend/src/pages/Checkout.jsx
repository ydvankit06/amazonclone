import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { api } from '../services/api.js';

function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (
      !items.length ||
      !fullName.trim() ||
      !phone.trim() ||
      !addressLine.trim() ||
      !city.trim() ||
      !state.trim() ||
      !pincode.trim()
    ) {
      return;
    }

    const shippingAddress = `${fullName}
${phone}
${addressLine}
${city}, ${state} - ${pincode}`;

    try {
      setProcessing(true);
      const res = await api.post('/orders', {
        shipping_address: shippingAddress,
        items: items.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity
        }))
      });
      clearCart();
      navigate('/order-success', { state: { orderId: res.data.id } });
    } catch (err) {
      setError('Failed to place order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (!items.length) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[2fr,1.4fr] gap-6">
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4"
      >
        <h1 className="text-xl font-semibold mb-2">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <textarea
            value={addressLine}
            onChange={(e) => setAddressLine(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pincode</label>
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={processing}
          className="px-6 py-2 bg-amazon-yellow text-black text-sm font-medium rounded-md hover:bg-yellow-400 disabled:opacity-60"
        >
          {processing ? 'Placing order...' : 'Place Order'}
        </button>
      </form>

      <aside className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit text-sm space-y-3">
        <h2 className="text-lg font-semibold mb-1">Order summary</h2>

        <div className="max-h-64 overflow-y-auto pr-1 border-b border-gray-200 pb-3 space-y-2">
          {items.map((item) => (
            <div key={item.product_id} className="flex justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm text-gray-900 line-clamp-2">{item.name}</p>
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

        <p className="flex justify-between">
          <span>Items:</span>
          <span className="font-semibold">{totalItems}</span>
        </p>
        <p className="flex justify-between">
          <span>Subtotal:</span>
          <span className="font-semibold">₹{total}</span>
        </p>

        <p className="text-xs text-gray-500 mt-2">
          This is a demo checkout. No real payments are processed.
        </p>
      </aside>
    </div>
  );
}

export default Checkout;

