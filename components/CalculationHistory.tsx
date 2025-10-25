import React from 'react';

export interface Calculation {
  id: string;
  expression: string;
  result: string;
  createdAt: Date;
}

interface CalculationHistoryProps {
  history: Calculation[];
  onHistoryItemClick: (expression: string) => void;
  loading: boolean;
}

const CalculationHistory: React.FC<CalculationHistoryProps> = ({ history, onHistoryItemClick, loading }) => {
  return (
    <div className="bg-calc-history-bg p-4 rounded-lg shadow-md max-h-96 overflow-y-auto custom-scrollbar">
      <h3 className="text-calc-text-primary text-xl font-semibold mb-4 border-b border-calc-history-border pb-2">History</h3>
      {loading ? (
        <p className="text-calc-text-secondary text-center py-4">Loading history...</p>
      ) : history.length === 0 ? (
        <p className="text-calc-text-secondary text-center py-4">No calculations yet.</p>
      ) : (
        <ul className="space-y-3">
          {history.map((item) => (
            <li
              key={item.id}
              className="bg-calc-display p-3 rounded-md shadow-sm cursor-pointer hover:bg-gray-700 transition-colors duration-200"
              onClick={() => onHistoryItemClick(item.expression)}
              role="button"
              tabIndex={0}
              aria-label={`Recall calculation: ${item.expression} equals ${item.result}`}
            >
              <div className="text-calc-text-secondary text-sm overflow-x-auto whitespace-nowrap no-scrollbar">
                {item.expression} =
              </div>
              <div className="text-calc-text-primary text-lg font-medium overflow-x-auto whitespace-nowrap no-scrollbar">
                {item.result}
              </div>
              <div className="text-xs text-gray-500 text-right mt-1">
                {new Date(item.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CalculationHistory;