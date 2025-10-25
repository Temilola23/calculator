import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CalculatorButtonProps {
  value: string;
  onClick: (value: string) => void;
  className?: string;
  type?: 'number' | 'operator' | 'special' | 'equals';
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({ value, onClick, className, type = 'number' }) => {
  const baseClasses = 'w-full h-16 sm:h-20 rounded-xl text-2xl sm:text-3xl font-semibold transition-all duration-200 shadow-calc-button flex items-center justify-center';

  const typeClasses = {
    number: 'bg-calc-btn-bg hover:bg-calc-btn-hover text-calc-text-primary',
    operator: 'bg-calc-btn-operator hover:bg-calc-btn-operator-hover text-white',
    special: 'bg-calc-btn-special hover:bg-calc-btn-special-hover text-calc-text-primary',
    equals: 'bg-calc-btn-equals hover:bg-calc-btn-equals-hover text-white',
  };

  return (
    <button
      onClick={() => onClick(value)}
      className={twMerge(baseClasses, typeClasses[type], className)}
      aria-label={value === '=' ? 'Equals' : value === 'C' ? 'Clear' : `Input ${value}`}
    >
      {value}
    </button>
  );
};

export default CalculatorButton;