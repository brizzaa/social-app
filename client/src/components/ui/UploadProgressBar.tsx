import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
    progress: number;
    isUploading: boolean;
    onComplete?: () => void;
}

export const UploadProgressBar: React.FC<ProgressBarProps> = ({ progress, isUploading, onComplete }) => {
    const [isVisible, setIsVisible] = useState(isUploading);
    const [isFinished, setIsFinished] = useState(false);

    const timerRef = React.useRef<NodeJS.Timeout | null>(null);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

    // Reset loop
    useEffect(() => {
        if (isUploading) {
            setIsVisible(true);
            setIsFinished(false);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    }, [isUploading]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // Completion logic
    useEffect(() => {
        if (progress === 100 && !isFinished) {
            setIsFinished(true);

            // Trigger explosion
            const duration = 2000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            intervalRef.current = setInterval(async () => {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0 && intervalRef.current) {
                    clearInterval(intervalRef.current);
                    return;
                }

                try {
                    const confetti = (await import('canvas-confetti')).default;
                    const particleCount = 50 * (timeLeft / duration);
                    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 } });
                } catch (e) {
                    console.error('Confetti error:', e);
                }
            }, 250);

            // Set timer to hide and callback
            // We use a ref so this timer survives the re-render caused by setIsFinished(true)
            timerRef.current = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => {
                    if (onComplete) onComplete();
                }, 200);
            }, 1000);
        }
    }, [progress, isFinished, onComplete]);

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
