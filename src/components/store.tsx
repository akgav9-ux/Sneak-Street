"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  slug: string;
  name: string;
  brand: string;
  image: string;
  size: string;
  color: string;
  price: number;
  oldPrice?: number | null;
  quantity: number;
};

export type WishItem = {
  slug: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  oldPrice?: number | null;
  rating: number;
  reviewCount: number;
};

export type Address = {
  id: string;
  label: string;
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
};

export type Profile = {
  name: string;
  email: string;
  phone: string;
};

type Toast = {
  id: number;
  title: string;
  description?: string;
  tone: "success" | "info" | "error";
};

type StoreValue = {
  ready: boolean;
  cart: CartItem[];
  wishlist: WishItem[];
  addresses: Address[];
  profile: Profile;
  cartCount: number;
  subtotal: number;
  addToCart: (item: CartItem) => void;
  setQuantity: (slug: string, size: string, color: string, qty: number) => void;
  removeFromCart: (slug: string, size: string, color: string) => void;
  clearCart: () => void;
  toggleWishlist: (item: WishItem) => boolean;
  isWished: (slug: string) => boolean;
  saveAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
  setProfile: (profile: Profile) => void;
  pushToast: (t: Omit<Toast, "id">) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

const CART_KEY = "ss.cart.v1";
const WISH_KEY = "ss.wishlist.v1";
const ADDR_KEY = "ss.addresses.v1";
const PROFILE_KEY = "ss.profile.v1";

const DEFAULT_PROFILE: Profile = {
  name: "Алексей Морозов",
  email: "alex.morozov@sneakstreet.ru",
  phone: "+7 (999) 123-45-67",
};

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: "addr-home",
    label: "Дом",
    fullName: "Алексей Морозов",
    street: "ул. Большая Дмитровка, 12, кв. 45",
    city: "Москва",
    postalCode: "125009",
    country: "Россия",
    phone: "+7 (999) 123-45-67",
    isDefault: true,
  },
];

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>(DEFAULT_ADDRESSES);
  const [profile, setProfileState] = useState<Profile>(DEFAULT_PROFILE);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);

  useEffect(() => {
    setCart(read<CartItem[]>(CART_KEY, []));
    setWishlist(read<WishItem[]>(WISH_KEY, []));
    setAddresses(read<Address[]>(ADDR_KEY, DEFAULT_ADDRESSES));
    setProfileState(read<Profile>(PROFILE_KEY, DEFAULT_PROFILE));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, ready]);
  useEffect(() => {
    if (ready) window.localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, ready]);
  useEffect(() => {
    if (ready) window.localStorage.setItem(ADDR_KEY, JSON.stringify(addresses));
  }, [addresses, ready]);
  useEffect(() => {
    if (ready) window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile, ready]);

  const pushToast = useCallback((t: Omit<Toast, "id">) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { ...t, id }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 3600);
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (c) =>
          c.slug === item.slug && c.size === item.size && c.color === item.color,
      );
      if (idx === -1) return [...prev, item];
      const next = prev.slice();
      next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity };
      return next;
    });
  }, []);

  const setQuantity = useCallback(
    (slug: string, size: string, color: string, qty: number) => {
      setCart((prev) =>
        prev
          .map((c) =>
            c.slug === slug && c.size === size && c.color === color
              ? { ...c, quantity: Math.max(1, Math.min(10, qty)) }
              : c,
          )
          .filter((c) => c.quantity > 0),
      );
    },
    [],
  );

  const removeFromCart = useCallback(
    (slug: string, size: string, color: string) => {
      setCart((prev) =>
        prev.filter(
          (c) => !(c.slug === slug && c.size === size && c.color === color),
        ),
      );
    },
    [],
  );

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((item: WishItem) => {
    let added = false;
    setWishlist((prev) => {
      const exists = prev.some((w) => w.slug === item.slug);
      added = !exists;
      return exists ? prev.filter((w) => w.slug !== item.slug) : [item, ...prev];
    });
    return added;
  }, []);

  const isWished = useCallback(
    (slug: string) => wishlist.some((w) => w.slug === slug),
    [wishlist],
  );

  const saveAddress = useCallback((address: Address) => {
    setAddresses((prev) => {
      const others = prev.filter((a) => a.id !== address.id);
      const next = address.isDefault
        ? others.map((a) => ({ ...a, isDefault: false }))
        : others;
      return [...next, address];
    });
  }, []);

  const removeAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const setProfile = useCallback((p: Profile) => setProfileState(p), []);

  const cartCount = cart.reduce((n, c) => n + c.quantity, 0);
  const subtotal = cart.reduce((n, c) => n + c.price * c.quantity, 0);

  const value = useMemo<StoreValue>(
    () => ({
      ready,
      cart,
      wishlist,
      addresses,
      profile,
      cartCount,
      subtotal,
      addToCart,
      setQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWished,
      saveAddress,
      removeAddress,
      setProfile,
      pushToast,
    }),
    [
      ready,
      cart,
      wishlist,
      addresses,
      profile,
      cartCount,
      subtotal,
      addToCart,
      setQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWished,
      saveAddress,
      removeAddress,
      setProfile,
      pushToast,
    ],
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-24 z-[120] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-slide-in-right pointer-events-auto flex items-start gap-3 border border-black/10 bg-white p-4 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.35)]"
          >
            <span
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${
                t.tone === "error"
                  ? "bg-[#e50000]"
                  : t.tone === "info"
                    ? "bg-[#111]"
                    : "bg-emerald-600"
              }`}
            >
              {t.tone === "error" ? "!" : t.tone === "info" ? "i" : "✓"}
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-bold tracking-tight">{t.title}</p>
              {t.description ? (
                <p className="mt-0.5 truncate text-[12px] text-[#8a8a8a]">
                  {t.description}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </StoreContext.Provider>
  );
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
