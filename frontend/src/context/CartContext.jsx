import { createContext, useContext, useMemo, useReducer } from 'react';

const CartContext = createContext(null);

const initialState = {
  items: []
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.product_id === action.payload.product_id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.product_id === action.payload.product_id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
    }
    case 'UPDATE_QUANTITY': {
      return {
        ...state,
        items: state.items.map((i) =>
          i.product_id === action.payload.product_id
            ? { ...i, quantity: action.payload.quantity }
            : i
        )
      };
    }
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((i) => i.product_id !== action.payload.product_id)
      };
    }
    case 'CLEAR_CART': {
      return initialState;
    }
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => {
    const total = state.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const cartItemsCount = state.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    return {
      items: state.items,
      total,
      cartItemsCount,
      addItem: (payload) => dispatch({ type: 'ADD_ITEM', payload }),
      updateQuantity: (product_id, quantity) =>
        dispatch({ type: 'UPDATE_QUANTITY', payload: { product_id, quantity } }),
      removeItem: (product_id) =>
        dispatch({ type: 'REMOVE_ITEM', payload: { product_id } }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' })
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return ctx;
}

