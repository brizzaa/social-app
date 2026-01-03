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
    <Card className="mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Cosa stai pensando?"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 bg-gray-50 hover:bg-white"
              rows={4}
              maxLength={POST_MAX_LENGTH}
            />
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className={`text-sm font-medium ${
                remainingChars < 20
                  ? 'text-red-500'
                  : remainingChars < 50
                  ? 'text-yellow-500'
                  : 'text-gray-500'
              }`}
            >
              {remainingChars} caratteri rimanenti
            </div>
            {error && (
              <p className="text-red-500 text-sm font-medium flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </p>
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
