"use client";
import { useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/app/lib/store";
import { initializeUser, User } from "@/app/store/authSlice";

interface StoreProviderProps {
  initialUser?: User | null;
  children: React.ReactNode;
}

export default function StoreProvider({
  initialUser,
  children,
}: StoreProviderProps) {
  const [store, setStore] = useState<AppStore | null>(null);

  useEffect(() => {
    const newStore = makeStore();
    if (initialUser) {
      newStore.dispatch(initializeUser(initialUser));
    }
    setStore(newStore);
  }, [initialUser]);

  if (!store) {
    return <div suppressHydrationWarning={true} />;
  }

  return <Provider store={store}>{children}</Provider>;
}
