import React, { useState } from 'react';
import { POST_MAX_LENGTH } from '../../../utils/constants';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface PostFormProps {
    onSubmit: (content: string) => Promise<void>;
    isLoading?: boolean;
}

export const PostForm: React.FC<PostFormProps> = ({ onSubmit, isLoading = false }) => {
    const [content, setContent] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!content.trim()) {
            setError('Il contenuto del post non può essere vuoto');
            return;
        }

        if (content.length > POST_MAX_LENGTH) {
            setError(`Il post deve essere ${POST_MAX_LENGTH} caratteri o meno`);
            return;
        }

        try {
            await onSubmit(content);
            setContent('');
        } catch (err) {
            setError('Impossibile creare il post. Per favore, riprova.');
        }
    };

    const remainingChars = POST_MAX_LENGTH - content.length;

    return (
        <Card className="mb-6 md:mb-8 border border-base-200 shadow-soft bg-base-100/50 backdrop-blur-sm">
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

                <div className="border-t border-base-200 px-0 pt-3 flex items-center justify-between mt-2">
                    <div className="flex items-center gap-4">
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
                        <Button
                            type="submit"
                            isLoading={isLoading}
                            disabled={!content.trim()}
                            size="md"
                            className="rounded-full px-6 bg-primary hover:bg-primary-focus text-white border-none shadow-md shadow-primary/20"
                        >
                            Pubblica
                        </Button>
                    </div>
                </div>
            </form>
        </Card>
    );
};
