'use client';

import React, { createContext, useContext, useReducer, ReactNode, useState } from 'react';
import type { CartItem, Product } from '@/lib/types';

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' };

type AuthState = {
  isAuthenticated: boolean;
  userEmail: string | null;
  generatedOtp: string | null;
  login: (email: string) => void;
  verify: () => void;
  logout: () => void;
};

type AppContextType = {
  cartState: CartState;
  dispatch: React.Dispatch<CartAction>;
  auth: AuthState;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(
        (item) => item.product.id === action.payload.id
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { product: action.payload, quantity: 1 }],
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== action.payload.id),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [cartState, dispatch] = useReducer(cartReducer, { items: [] });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);

  const login = (email: string) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setUserEmail(email);
  };

  const verify = () => {
    setIsAuthenticated(true);
    setGeneratedOtp(null);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    setGeneratedOtp(null);
  };

  const auth = { isAuthenticated, userEmail, generatedOtp, login, verify, logout };

  return (
    <AppContext.Provider value={{ cartState, dispatch, auth }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const useAuth = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AppProvider');
  }
  return context.auth;
};

export const useCart = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useCart must be used within an AppProvider');
  }
  return { cartState: context.cartState, dispatch: context.dispatch };
};
