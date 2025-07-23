
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', titleClassName = '', footer }) => {
  return (
    <div className={`bg-white shadow-lg rounded-xl overflow-hidden ${className}`}>
      {title && (
        <div className={`p-4 sm:p-6 border-b border-neutral-200 ${titleClassName}`}>
          <h3 className="text-lg sm:text-xl font-semibold text-neutral-800">{title}</h3>
        </div>
      )}
      <div className="p-4 sm:p-6">
        {children}
      </div>
      {footer && (
        <div className="p-4 sm:p-6 bg-neutral-50 border-t border-neutral-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
    