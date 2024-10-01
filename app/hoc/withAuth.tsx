"use client";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { getUser } from "@/app/store/authSlice";
import type { RootState, AppDispatch } from "@/app/store"; // Ensure you have these types

const withAuth = (Component: React.ComponentType, adminOnly = false) => {
  return function AuthenticatedComponent(props: any) {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { user, loading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
      if (!user) {
        dispatch(getUser());
      }
    }, [dispatch, user]);

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.push("/login");
        } else if (adminOnly && !user.isAdmin) {
          router.push("/unauthorized");
        }
      }
    }, [user, loading, adminOnly, router]);

    if (loading || !user) {
      return <p>Loading...</p>; // Or any loading indicator
    }

    return <Component {...props} />;
  };
};

export default withAuth;
