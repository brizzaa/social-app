import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
}) => {
  return (
    <div
      className={`card bg-base-100 shadow-md border border-base-300/50 ${hover ? 'hover:shadow-xl hover:border-base-300 transition-all duration-200 cursor-pointer' : 'transition-shadow duration-200'} ${className}`}
    >
      <div className="card-body p-4 md:p-5">
        {children}
      </div>
    </div>
  );
};
