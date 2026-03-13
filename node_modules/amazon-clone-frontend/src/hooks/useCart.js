import { useCartContext } from '../context/CartContext.jsx';

export function useCart() {
  return useCartContext();
}

