import { CartItem } from "./cartReducer";

export const addToCart = (product: CartItem) => ({
  type: "ADD_TO_CART" as const,
  payload: product,
});

export const removeFromCart = (id: string) => ({
  type: "REMOVE_FROM_CART" as const,
  payload: id,
});

export const increaseQuantity = (itemId: string) => ({
  type: "INCREASE_QUANTITY" as const,
  payload: itemId,
});

export const decreaseQuantity = (itemId: string) => ({
  type: "DECREASE_QUANTITY" as const,
  payload: itemId,
});

export const CLEAR_CART = "CLEAR_CART";

export const clearCart = () => ({
  type: CLEAR_CART as typeof CLEAR_CART,
});



