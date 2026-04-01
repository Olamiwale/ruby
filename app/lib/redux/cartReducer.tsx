import { CLEAR_CART } from './actions';

const saveCartToLocalStorage = (cartItems) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }
};

const loadCartFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  }
  return [];
};

const initialState = {
  cartItems: [],
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const exists = state.cartItems.find(item => item.id === action.payload.id);
      if (exists) {
        return { ...state };
      } else {
        const updatedCart = [...state.cartItems, action.payload];
        saveCartToLocalStorage(updatedCart);
        return { ...state, cartItems: updatedCart };
      }

    case 'REMOVE_FROM_CART':
      const filteredCart = state.cartItems.filter(item => item.id !== action.payload);
      saveCartToLocalStorage(filteredCart);
      return { ...state, cartItems: filteredCart };

    case 'INCREASE_QUANTITY':
      const increasedCart = state.cartItems.map(item =>
        item.id === action.payload ? { ...item, quantity: item.quantity + 1 } : item
      );
      saveCartToLocalStorage(increasedCart);
      return { ...state, cartItems: increasedCart };

    case 'DECREASE_QUANTITY':
      const decreasedCart = state.cartItems.map(item =>
        item.id === action.payload && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      saveCartToLocalStorage(decreasedCart);
      return { ...state, cartItems: decreasedCart };

    case CLEAR_CART:
      saveCartToLocalStorage([]); // ← was missing, cart persisted after payment
      return { ...state, cartItems: [] };

    case 'HYDRATE_CART':
      // Restore cart from localStorage after client-side hydration
      return { ...state, cartItems: action.payload };

    default:
      return state;
  }
};

export default cartReducer;