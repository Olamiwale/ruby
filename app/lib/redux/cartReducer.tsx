import { CLEAR_CART } from "./actions";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  images?: string[];
}

interface CartState {
  cartItems: CartItem[];
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "INCREASE_QUANTITY"; payload: string }
  | { type: "DECREASE_QUANTITY"; payload: string }
  | { type: "HYDRATE_CART"; payload: CartItem[] }
  | { type: typeof CLEAR_CART };

const saveCartToLocalStorage = (cartItems: CartItem[]): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }
};

const loadCartFromLocalStorage = (): CartItem[] => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("cartItems");
    return saved ? (JSON.parse(saved) as CartItem[]) : [];
  }
  return [];
};

const initialState: CartState = {
  cartItems: loadCartFromLocalStorage(),
};

const cartReducer = (state: CartState = initialState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const exists = state.cartItems.find((item) => item.id === action.payload.id);
      if (exists) return state;
      const updated = [...state.cartItems, action.payload];
      saveCartToLocalStorage(updated);
      return { ...state, cartItems: updated };
    }
    case "REMOVE_FROM_CART": {
      const filtered = state.cartItems.filter((item) => item.id !== action.payload);
      saveCartToLocalStorage(filtered);
      return { ...state, cartItems: filtered };
    }
    case "INCREASE_QUANTITY": {
      const increased = state.cartItems.map((item) =>
        item.id === action.payload ? { ...item, quantity: item.quantity + 1 } : item
      );
      saveCartToLocalStorage(increased);
      return { ...state, cartItems: increased };
    }
    case "DECREASE_QUANTITY": {
      const decreased = state.cartItems.map((item) =>
        item.id === action.payload && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      saveCartToLocalStorage(decreased);
      return { ...state, cartItems: decreased };
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