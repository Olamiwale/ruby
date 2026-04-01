"use client";

import { useEffect, ReactNode } from "react";
import { Provider, useDispatch } from "react-redux";
import store from "@/app/lib/redux/store";
import { CartItem } from "@/app/lib/redux/cartReducer";

interface Props {
  children: ReactNode;
}

function CartHydrator({ children }: Props) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("cartItems");
    if (!saved) return;
    try {
      const cartItems: CartItem[] = JSON.parse(saved);
      dispatch({ type: "HYDRATE_CART", payload: cartItems });
    } catch (e) {
      console.error("Failed to load cart from localStorage:", e);
    }
  }, [dispatch]);

  return <>{children}</>;
}

export default function ReduxProvider({ children }: Props) {
  return (
    <Provider store={store}>
      <CartHydrator>{children}</CartHydrator>
    </Provider>
  );
}