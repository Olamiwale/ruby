import { CLEAR_CART } from "./actions";

// ── Types ──────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  images?: string[];
  [key: string]: any;
}

interface CartState {
  cartItems: CartItem[];
}

interface CartAction {
  type: string;
  payload?: any;
}

// ── localStorage helpers ───────────────────────────────────────────────────

const saveCartToLocalStorage = (cartItems: CartItem[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }
};

const loadCartFromLocalStorage = (): CartItem[] => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  }
  return [];
};

// ── Initial state ──────────────────────────────────────────────────────────

const initialState: CartState = {
  cartItems: loadCartFromLocalStorage(),
};

// ── Reducer ────────────────────────────────────────────────────────────────

const cartReducer = (state: CartState = initialState, action: CartAction): CartState => {
  switch (action.type) {

    case "ADD_TO_CART": {
      const exists = state.cartItems.find((item) => item.id === action.payload.id);
      if (exists) return state; // return same reference — no unnecessary re-render
      const updatedCart = [...state.cartItems, action.payload];
      saveCartToLocalStorage(updatedCart);
      return { ...state, cartItems: updatedCart };
    }

    case "REMOVE_FROM_CART": {
      const filteredCart = state.cartItems.filter((item) => item.id !== action.payload);
      saveCartToLocalStorage(filteredCart);
      return { ...state, cartItems: filteredCart };
    }

    case "INCREASE_QUANTITY": {
      const increasedCart = state.cartItems.map((item) =>
        item.id === action.payload ? { ...item, quantity: item.quantity + 1 } : item
      );
      saveCartToLocalStorage(increasedCart);
      return { ...state, cartItems: increasedCart };
    }

    case "DECREASE_QUANTITY": {
      const decreasedCart = state.cartItems.map((item) =>
        item.id === action.payload && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      saveCartToLocalStorage(decreasedCart);
      return { ...state, cartItems: decreasedCart };
    }

    case CLEAR_CART: {
      saveCartToLocalStorage([]);
      return { ...state, cartItems: [] };
    }

    case "HYDRATE_CART": {
      return { ...state, cartItems: action.payload };
    }

    default:
      return state;
  }
};

export default cartReducer;