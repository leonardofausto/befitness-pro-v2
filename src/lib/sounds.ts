import { useAppStore } from "./store";

const SOUNDS = {
    SUCCESS: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
    CLICK: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3",
    OPEN: "https://assets.mixkit.co/active_storage/sfx/2567/2567-preview.mp3",
} as const;

export const playSound = (soundName: keyof typeof SOUNDS) => {
    const { isSoundEnabled } = useAppStore.getState();

    if (!isSoundEnabled) return;

    try {
        const audio = new Audio(SOUNDS[soundName]);
        audio.volume = 0.4;
        audio.play().catch(e => console.log("Sound play prevented by browser policy", e));
    } catch (error) {
        console.error("Error playing sound:", error);
    }
};
