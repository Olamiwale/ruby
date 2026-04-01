'use client';

import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import store from '@/app/lib/redux/store';

function CartHydrator({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load cart from localStorage after client-side hydration
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        try {
          const cartItems = JSON.parse(savedCart);
          // Dispatch action to restore cart
          dispatch({
            type: 'HYDRATE_CART',
            payload: cartItems,
          });
        } catch (e) {
          console.error('Failed to load cart from localStorage:', e);
        }
      }
    }
  }, [dispatch]);

  return children;
}

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <CartHydrator>{children}</CartHydrator>
    </Provider>
  );
}
