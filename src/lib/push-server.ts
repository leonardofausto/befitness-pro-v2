"use server";

import webpush from "web-push";

const vapidKeys = {
    publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    privateKey: process.env.PRIVATE_VAPID_KEY!,
};

webpush.setVapidDetails(
    "mailto:suporte@befitnesspro.com",
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

export async function sendPushNotification(subscription: any, payload: { title: string; body: string }) {
    try {
        await webpush.sendNotification(subscription, JSON.stringify(payload));
        return { success: true };
    } catch (error) {
        console.error("Erro ao enviar push:", error);
        return { success: false, error };
    }
}
