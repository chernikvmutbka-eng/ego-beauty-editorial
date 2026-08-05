"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { track } from "@/lib/analytics";

type Promo = { code: string; discount: number } | null;
type StoreContextValue = {
  cart: Record<string, number>;
  favorites: string[];
  promo: Promo;
  cartCount: number;
  addToCart: (id: string, quantity?: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  toggleFavorite: (id: string) => void;
  applyPromo: (code: string, discount?: number) => boolean;
  clearCart: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [promo, setPromo] = useState<Promo>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        setCart(JSON.parse(localStorage.getItem("ego-cart") ?? "{}"));
        setFavorites(JSON.parse(localStorage.getItem("ego-favorites") ?? "[]"));
        setPromo(JSON.parse(localStorage.getItem("ego-promo") ?? "null"));
      } catch {
        setCart({});
        setFavorites([]);
        setPromo(null);
      }
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("ego-cart", JSON.stringify(cart));
    localStorage.setItem("ego-favorites", JSON.stringify(favorites));
    localStorage.setItem("ego-promo", JSON.stringify(promo));
  }, [cart, favorites, promo, hydrated]);

  const addToCart = useCallback((id: string, quantity = 1) => {
    setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + quantity }));
    track("add_to_cart", { product_id: id, quantity });
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
      return;
    }
    setCart((current) => ({ ...current, [id]: Math.min(20, quantity) }));
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    track("remove_from_cart", { product_id: id });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((current) => {
      const exists = current.includes(id);
      if (!exists) track("add_to_wishlist", { product_id: id });
      return exists ? current.filter((item) => item !== id) : [...current, id];
    });
  }, []);

  const applyPromo = useCallback((rawCode: string, explicitDiscount?: number) => {
    const code = rawCode.trim().toUpperCase();
    const knownDiscount = code === "EGO10" || code === "WELCOME10" ? 10 : undefined;
    const wheelDiscount = code.startsWith("EGO-") ? (explicitDiscount ?? 7) : undefined;
    const discount = explicitDiscount ?? knownDiscount ?? wheelDiscount;
    if (!discount || discount < 1 || discount > 20) return false;
    setPromo({ code, discount });
    track("promo_apply", { code, discount });
    return true;
  }, []);

  const value = useMemo<StoreContextValue>(() => ({
    cart,
    favorites,
    promo,
    cartCount: Object.values(cart).reduce((sum, value) => sum + value, 0),
    addToCart,
    setQuantity,
    removeFromCart,
    toggleFavorite,
    applyPromo,
    clearCart: () => setCart({}),
  }), [cart, favorites, promo, addToCart, setQuantity, removeFromCart, toggleFavorite, applyPromo]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used inside StoreProvider");
  return value;
}
