"use client";

import { usePushNotifications } from "@/hooks/use-push-notifications";
import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

export function PushInitializer() {
    const { isSupported, subscribe } = usePushNotifications();
    const { isNotificationsEnabled } = useAppStore();

    useEffect(() => {
        if (isNotificationsEnabled && isSupported) {
            subscribe();
        }
    }, [isNotificationsEnabled, isSupported, subscribe]);

    return null;
}
