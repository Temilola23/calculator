'use client';

import React, { useState, useEffect, useCallback } from 'react';
import CalculatorDisplay from '@/components/CalculatorDisplay';
import CalculatorButton from '@/components/CalculatorButton';
import CalculationHistory, { Calculation } from '@/components/CalculationHistory';
import { getCalculationHistory, saveCalculation } from '@/src/actions/calculatorActions';

const Home: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<string>('0');
  const [history, setHistory] = useState<Calculation[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(true);
  const [awaitingNewInput, setAwaitingNewInput] = useState<boolean>(false); // True when result is displayed, and next number clears input
  const [lastButtonWasEquals, setLastButtonWasEquals] = useState<boolean>(false);

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    const historyData = await getCalculationHistory();
    setHistory(historyData);
    setHistoryLoading(false);
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleEvaluate = useCallback(async (expressionToEvaluate: string) => {
    if (!expressionToEvaluate.trim()) {
      setResult('0');
      return;
    }

    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expression: expressionToEvaluate }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.result);
        await saveCalculation(expressionToEvaluate, data.result);
        await fetchHistory(); // Refresh history
      } else {
        setResult(data.error || 'Error');
      }
    } catch (error) {
      console.error('Failed to evaluate expression:', error);
      setResult('Error');
    }
  }, [fetchHistory]);

  const handleButtonClick = useCallback((value: string) => {
    if (value === 'C') {
      setInput('');
      setResult('0');
      setAwaitingNewInput(false);
      setLastButtonWasEquals(false);
      return;
    }

    if (value === '=') {
      if (input.trim() === '') return; // Don't evaluate empty input
      handleEvaluate(input);
      setAwaitingNewInput(true);
      setLastButtonWasEquals(true);
      return;
    }

    if (lastButtonWasEquals && (/[0-9]|\./).test(value)) {
      // If the last button was '=', and a number or decimal is pressed, start a new calculation
      setInput(value);
      setResult('0'); // Reset result display until new evaluation
      setAwaitingNewInput(false);
      setLastButtonWasEquals(false);
      return;
    } else if (awaitingNewInput && !(/[+\-*/%]/).test(value)) {
      // If result is displayed and a non-operator is pressed, clear input
      setInput(value);
      setResult('0');
      setAwaitingNewInput(false);
      setLastButtonWasEquals(false);
      return;
    } else if (awaitingNewInput && (/[+\-*/%]/).test(value)) {
      // If result is displayed and an operator is pressed, continue with the result
      setInput(`${result}${value}`);
      setResult('0');
      setAwaitingNewInput(false);
      setLastButtonWasEquals(false);
      return;
    }


    // Prevent multiple operators or decimals unless valid
    const lastChar = input.slice(-1);
    const isOperator = (char: string) => /[+\-*/%]$/.test(char);
    const isDecimal = (char: string) => char === '.';

    if (isOperator(value) && isOperator(lastChar)) {
      // Replace last operator if a new one is pressed
      setInput(input.slice(0, -1) + value);
      return;
    }
    if (isDecimal(value) && isDecimal(lastChar)) {
      // Prevent multiple decimals consecutively
      return;
    }
    // Prevent multiple decimals in the current number segment
    if (isDecimal(value) && input.split(/[\+\-\*\/%]/).pop()?.includes('.')) {
      return;
    }
    // Prevent operator at start if input is empty
    if (input === '' && isOperator(value)) {
        // Maybe allow '-' for negative numbers at start
        if (value === '-') {
            setInput(value);
        }
        return;
    }
    // Prevent leading zero if input is just '0'
    if (input === '0' && value !== '.' && !isOperator(value)) {
        setInput(value);
        return;
    }

    // Handle +/- (toggle sign of the current number or the result)
    if (value === '+/-') {
      if (lastButtonWasEquals) {
        // Toggle sign of the displayed result
        try {
          const numResult = parseFloat(result);
          if (!isNaN(numResult)) {
            setResult((-numResult).toString());
            setInput((-numResult).toString()); // Also update input for continuity
          }
        } catch (e) { /* ignore if not a valid number */ }
      } else {
        // Toggle sign of the last number in the current input
        const parts = input.match(/(\d+\.?\d*|\.?\d+)([+\-*/%])?$/);
        if (parts && parts[1]) {
          const lastNumStr = parts[1];
          const newNumStr = (parseFloat(lastNumStr) * -1).toString();
          setInput(input.substring(0, input.length - lastNumStr.length) + newNumStr);
        } else if (input !== '') { // If no clear number, try to apply to whole input (e.g., if only one number)
            try {
                const numInput = parseFloat(input);
                if (!isNaN(numInput)) {
                    setInput((-numInput).toString());
                } else if (input === '-') { // If currently just '-', pressing +/- makes it ''
                    setInput('');
                } else if (input.startsWith('-')) { // If already negative
                    setInput(input.substring(1));
                } else { // If positive
                    setInput('-' + input);
                }
            } catch (e) { /* ignore */ }
        } else if (input === '') {
            setInput('-'); // Start with a negative sign
        }
      }
      setAwaitingNewInput(false);
      setLastButtonWasEquals(false);
      return;
    }

    // Handle percentage
    if (value === '%') {
      if (lastButtonWasEquals) {
        try {
          const numResult = parseFloat(result);
          if (!isNaN(numResult)) {
            setResult((numResult / 100).toString());
            setInput((numResult / 100).toString());
          }
        } catch (e) { /* ignore */ }
      } else {
        const parts = input.match(/(\d+\.?\d*|\.?\d+)([+\-*/%])?$/);
        if (parts && parts[1]) {
          const lastNumStr = parts[1];
          const newNumStr = (parseFloat(lastNumStr) / 100).toString();
          setInput(input.substring(0, input.length - lastNumStr.length) + newNumStr);
        }
      }
      setAwaitingNewInput(false);
      setLastButtonWasEquals(false);
      return;
    }

    setInput((prevInput) => prevInput + value);
    setAwaitingNewInput(false);
    setLastButtonWasEquals(false);

  }, [input, result, awaitingNewInput, lastButtonWasEquals, handleEvaluate]);

  const handleHistoryItemClick = useCallback((expression: string) => {
    setInput(expression);
    setResult('0'); // Clear previous result display
    setAwaitingNewInput(false);
    setLastButtonWasEquals(false);
  }, []);

  const buttonLayout = [
    { value: 'C', type: 'special' }, { value: '+/-', type: 'special' }, { value: '%', type: 'special' }, { value: '/', type: 'operator' },
    { value: '7', type: 'number' }, { value: '8', type: 'number' }, { value: '9', type: 'number' }, { value: '*', type: 'operator' },
    { value: '4', type: 'number' }, { value: '5', type: 'number' }, { value: '6', type: 'number' }, { value: '-', type: 'operator' },
    { value: '1', type: 'number' }, { value: '2', type: 'number' }, { value: '3', type: 'number' }, { value: '+', type: 'operator' },
    { value: '0', type: 'number', className: 'col-span-2' }, { value: '.', type: 'number' }, { value: '=', type: 'equals' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 w-full max-w-6xl mx-auto">
      {/* Calculator Interface */}
      <div className="flex-1 min-w-full md:min-w-0 max-w-lg mx-auto md:mx-0 bg-calc-bg p-6 rounded-2xl shadow-2xl">
        <CalculatorDisplay input={input} result={result} />
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {buttonLayout.map((button) => (
            <CalculatorButton
              key={button.value}
              value={button.value}
              onClick={handleButtonClick}
              type={button.type}
              className={button.className}
            />
          ))}
        </div>
      </div>

      {/* History Panel */}
      <div className="w-full md:w-80 lg:w-96 flex-shrink-0">
        <CalculationHistory history={history} onHistoryItemClick={handleHistoryItemClick} loading={historyLoading} />
      </div>
    </div>
  );
};

export default Home;