import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
    progress: number;
    isUploading: boolean;
    onComplete?: () => void;
}

export const UploadProgressBar: React.FC<ProgressBarProps> = ({ progress, isUploading, onComplete }) => {
    const [isVisible, setIsVisible] = useState(isUploading);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        if (isUploading) {
            setIsVisible(true);
            setIsFinished(false);
        }

        if (progress === 100 && !isFinished) {
            setIsFinished(true);

            // Trigger explosion
            const duration = 2000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(async () => {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);

                try {
                    const confetti = (await import('canvas-confetti')).default;
                    const particleCount = 50 * (timeLeft / duration);
                    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 } });
                } catch (e) {
                    console.error('Confetti error:', e);
                }
            }, 250);

            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => {
                    if (onComplete) onComplete();
                }, 200);
            }, 1000);

            return () => {
                clearInterval(interval);
                clearTimeout(timer);
            };
        }
    }, [progress, isUploading, onComplete, isFinished]);

    if (!isVisible && !isUploading && !isFinished) return null;

    const displayProgress = isFinished ? 100 : progress;

    return (
        <div className={`flex flex-col items-center justify-center min-w-[120px] transition-all duration-500 ${!isVisible ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
            <div className="w-full bg-base-300/30 rounded-full h-1.5 overflow-hidden mb-1.5">
                <div
                    className="h-full bg-primary transition-all duration-300 ease-out rounded-full shadow-[0_0_8px_rgba(var(--p),0.5)]"
                    style={{ width: `${displayProgress}%` }}
                />
            </div>
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.1em] pointer-events-none">
                {displayProgress < 100 ? `SENDING ${displayProgress}%` : 'SUCCESS'}
            </span>
        </div>
    );
};
