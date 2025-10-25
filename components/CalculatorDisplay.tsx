import React from 'react';

interface CalculatorDisplayProps {
  input: string;
  result: string;
}

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({ input, result }) => {
  return (
    <div className="bg-calc-display p-6 rounded-lg text-right mb-4 shadow-inner">
      <div className="text-calc-text-secondary text-2xl h-8 overflow-hidden whitespace-nowrap">
        {input || '0'}
      </div>
      <div className="text-calc-text-primary text-5xl font-light h-14 flex items-center justify-end overflow-hidden whitespace-nowrap">
        {result || '0'}
      </div>
    </div>
  );
};

export default CalculatorDisplay;