import { NextResponse } from 'next/server';
import { safeEvaluateExpression } from '@/src/lib/utils';

/**
 * Handles POST requests to evaluate a mathematical expression.
 * Expects a JSON body with an 'expression' field.
 * Returns the calculated 'result' or an 'error' message.
 */
export async function POST(request: Request) {
  try {
    const { expression } = await request.json();

    if (typeof expression !== 'string' || !expression.trim()) {
      return NextResponse.json({ error: 'Invalid or empty expression provided.' }, { status: 400 });
    }

    const result = safeEvaluateExpression(expression);

    if (result.startsWith('Error')) {
      return NextResponse.json({ error: result }, { status: 400 });
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error('API /api/evaluate error:', error);
    return NextResponse.json({ error: 'An unexpected server error occurred.' }, { status: 500 });
  }
}