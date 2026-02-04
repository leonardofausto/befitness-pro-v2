"use client";

import { useCallback, useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";


export function usePushNotifications() {
    const saveSubscription = useMutation(api.notifications.saveSubscription);
    const [isSupported, setIsSupported] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);

    useEffect(() => {
        if ("serviceWorker" in navigator && "PushManager" in window) {
            setIsSupported(true);
            registerServiceWorker();
        }
    }, []);

    async function registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register("/sw.js");
            const existingSubscription = await registration.pushManager.getSubscription();
            setSubscription(existingSubscription);
        } catch (error) {
            console.error("Erro ao registrar Service Worker:", error);
        }
    }

    const subscribe = useCallback(async () => {
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

        if (!vapidPublicKey) {
            console.error("VAPID Public Key não encontrada no ambiente");
            return;
        }

        try {
            const registration = await navigator.serviceWorker.ready;
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey.trim()),
            });

            const subJson = sub.toJSON();
            if (subJson.endpoint && subJson.keys?.p256dh && subJson.keys?.auth) {
                await saveSubscription({
                    endpoint: subJson.endpoint,
                    expirationTime: subJson.expirationTime || null,
                    keys: {
                        p256dh: subJson.keys.p256dh,
                        auth: subJson.keys.auth,
                    },
                });
                setSubscription(sub);
            }
        } catch (error) {
            console.error("Erro ao se inscrever para push:", error);
        }
    }, [saveSubscription]);

    return { isSupported, subscription, subscribe };
}

function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

    try {
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    } catch (e) {
        console.error("Erro ao converter base64 para Uint8Array:", e);
        throw new Error("VAPID URL base64 inválida");
    }
}
