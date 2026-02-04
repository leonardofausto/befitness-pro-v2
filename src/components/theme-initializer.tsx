"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

export function ThemeInitializer() {
    const isOledMode = useAppStore((state) => state.isOledMode);

    useEffect(() => {
        if (isOledMode) {
            document.documentElement.classList.add("oled-mode");
        } else {
            document.documentElement.classList.remove("oled-mode");
        }
    }, [isOledMode]);

    return null;
}
