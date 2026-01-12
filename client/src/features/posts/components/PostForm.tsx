import React, { useState, useCallback } from 'react';
import { POST_MAX_LENGTH } from '../../../utils/constants';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { UploadProgressBar } from '../../../components/ui/UploadProgressBar';

interface PostFormProps {
    onSubmit: (content: string, video?: File, onProgress?: (p: number) => void) => Promise<void>;
    isLoading?: boolean;
}

export const PostForm: React.FC<PostFormProps> = ({ onSubmit, isLoading = false }) => {
    const [content, setContent] = useState('');
    const [video, setVideo] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 50 * 1024 * 1024) {
                setError('Il video non può superare i 50MB');
                return;
            }
            setVideo(file);
            setVideoPreview(URL.createObjectURL(file));
            setError(null);
        }
    };

    const removeVideo = () => {
        setVideo(null);
        if (videoPreview) {
            URL.revokeObjectURL(videoPreview);
            setVideoPreview(null);
        }
    };

    const handleComplete = useCallback(() => {
        setUploadProgress(0);
        setIsAnimating(false);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!content.trim() && !video) {
            setError('Il post deve avere almeno testo o un video');
            return;
        }

        if (content.length > POST_MAX_LENGTH) {
            setError(`Il post deve essere ${POST_MAX_LENGTH} caratteri o meno`);
            return;
        }

        try {
            setUploadProgress(0);
            setIsAnimating(false);

            await onSubmit(content, video || undefined, (progress) => {
                setUploadProgress(progress);
                if (progress > 0) setIsAnimating(true);
            });

            // Assicuriamoci che la barra arrivi al 100% e mostri il successo
            setUploadProgress(100);
            setIsAnimating(true);

            setContent('');
            removeVideo();
        } catch (err) {
            setError('Impossibile creare il post. Per favore, riprova.');
            setUploadProgress(0);
            setIsAnimating(false);
        }
    };

    const remainingChars = POST_MAX_LENGTH - content.length;

    return (
        <Card className="mb-6 md:mb-8 border border-base-200 shadow-soft bg-base-100/50 backdrop-blur-sm overflow-hidden">
            <form onSubmit={handleSubmit} className="relative">
                <div className="form-control w-full group">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Cosa c'è di nuovo?"
                        className="textarea w-full resize-none min-h-[120px] px-0 py-2 focus:outline-none bg-transparent text-lg placeholder:text-base-content/40 leading-relaxed border-none focus:ring-0"
                        rows={3}
                        maxLength={POST_MAX_LENGTH}
                        aria-label="Contenuto del post"
                    />
                </div>

                {videoPreview && (
                    <div className="relative mb-4 rounded-xl overflow-hidden border border-base-200 bg-base-200/50 max-w-sm">
                        <video src={videoPreview} className="w-full h-auto" controls />
                        <button
                            type="button"
                            onClick={removeVideo}
                            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                            aria-label="Rimuovi video"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                )}

                <div className="border-t border-base-200 px-0 pt-3 flex items-center justify-between mt-2">
                    <div className="flex items-center gap-4">
                        <label className="cursor-pointer p-2 rounded-full hover:bg-primary/10 text-primary transition-colors group/upload" title="Carica video">
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoChange}
                                className="hidden"
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover/upload:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </label>
                        <div
                            className={`text-xs font-medium transition-colors ${remainingChars < 20
                                ? 'text-error'
                                : remainingChars < 50
                                    ? 'text-warning'
                                    : 'text-base-content/40'
                                }`}
                        >
                            {remainingChars}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {error && (
                            <span className="text-error text-xs font-medium animate-fade-in">{error}</span>
                        )}
                        {isAnimating || isLoading ? (
                            <UploadProgressBar
                                progress={uploadProgress}
                                isUploading={isLoading}
                                onComplete={handleComplete}
                            />
                        ) : (
                            <Button
                                type="submit"
                                isLoading={isLoading}
                                disabled={!content.trim() && !video}
                                size="md"
                                className="rounded-full px-6 bg-primary hover:bg-primary-focus text-white border-none shadow-md shadow-primary/20"
                            >
                                Pubblica
                            </Button>
                        )}
                    </div>
                </div>
            </form>
        </Card>
    );
};
