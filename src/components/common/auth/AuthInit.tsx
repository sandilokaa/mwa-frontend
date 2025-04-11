"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchCurrentUser } from "@/store/slice/authSlice";

export default function AuthInit() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchCurrentUser());
    }, [dispatch]);

    return null; 
}
