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
    <Card className="mb-4 md:mb-6">
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Cosa stai pensando?"
            className="textarea textarea-bordered w-full resize-none min-h-[100px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
            rows={4}
            maxLength={POST_MAX_LENGTH}
            aria-label="Contenuto del post"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div
              className={`text-sm font-medium ${
                remainingChars < 20
                  ? 'text-error'
                  : remainingChars < 50
                  ? 'text-warning'
                  : 'text-base-content/70'
              }`}
            >
              {remainingChars} caratteri rimanenti
            </div>
            {error && (
              <div className="alert alert-error alert-sm py-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs">{error}</span>
              </div>
            )}
          </div>
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={!content.trim()}
            size="md"
          >
            Pubblica
          </Button>
        </div>
      </form>
    </Card>
  );
};
