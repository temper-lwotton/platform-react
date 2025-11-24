// hooks/useCurrentUserId.ts
"use client";

import { useEffect, useState } from "react";
import { getCurrentUserId as getCurrentUserIdSync } from "@/lib/auth"; // adjust path

export function useCurrentUserId() {
    const [userId, setUserId] = useState<string | null>(null);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);
        const stored = getCurrentUserIdSync(); // this now runs only in the browser
        setUserId(stored);
    }, []);

    return { userId, hydrated };
}
