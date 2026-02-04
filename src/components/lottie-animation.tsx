"use client";

import Lottie from "lottie-react";

interface LottieAnimationProps {
    animationData: any;
    loop?: boolean;
    autoplay?: boolean;
    className?: string;
    onComplete?: () => void;
}

export function LottieAnimation({
    animationData,
    loop = true,
    autoplay = true,
    className,
    onComplete
}: LottieAnimationProps) {
    return (
        <div className={className}>
            <Lottie
                animationData={animationData}
                loop={loop}
                autoplay={autoplay}
                onComplete={onComplete}
            />
        </div>
    );
}
