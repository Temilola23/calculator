// src/lib/utils.ts
import * as math from 'mathjs';

/**
 * Safely evaluates a mathematical expression string.
 * Uses mathjs to prevent security vulnerabilities associated with `eval()`.
 * @param expression The mathematical expression as a string.
 * @returns The result of the expression as a string, or 'Error' if evaluation fails.
 */
export function safeEvaluateExpression(expression: string): string {
  if (!expression.trim()) {
    return '0';
  }

  // Basic validation to prevent arbitrary code execution, although mathjs is safer than raw eval
  // This helps catch common malformed inputs before mathjs tries to parse them
  const validExpressionRegex = /^[\d\s\.\+\-\*\/\(\)]+$/;
  if (!validExpressionRegex.test(expression)) {
    return 'Error: Invalid characters';
  }

  try {
    // mathjs handles a wide range of mathematical operations safely
    const result = math.evaluate(expression);

    // Check if the result is a number or a complex number, then convert to string
    if (typeof result === 'number') {
      // Limit decimal places for display, e.g., to 10 decimal places
      return parseFloat(result.toFixed(10)).toString();
    } else if (typeof result === 'object' && 're' in result && 'im' in result) {
      // Handle complex numbers if mathjs returns them (e.g., sqrt(-1))
      return `${result.re}${result.im >= 0 ? '+' : ''}${result.im}i`;
    } else {
      // For other unexpected results from math.evaluate
      return 'Error: Invalid expression';
    }
  } catch (error) {
    console.error('Error evaluating expression:', error);
    // Return a user-friendly error message
    return 'Error';
  }
}