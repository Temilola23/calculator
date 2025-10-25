'use server';

import prisma from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

/**
 * Saves a calculation to the database.
 * @param expression The mathematical expression that was calculated.
 * @param result The result of the calculation.
 * @returns The saved Calculation object or null if an error occurred.
 */
export async function saveCalculation(expression: string, result: string) {
  try {
    const newCalculation = await prisma.calculation.create({
      data: {
        id: uuidv4(), // Generate a UUID for the ID
        expression,
        result,
      },
    });
    revalidatePath('/'); // Revalidate the home page to show updated history
    return newCalculation;
  } catch (error) {
    console.error('Failed to save calculation:', error);
    // In a real app, you might want to log this to an error tracking service
    return null;
  }
}

/**
 * Fetches all calculation history from the database.
 * Ordered by creation date, most recent first.
 * @returns An array of Calculation objects.
 */
export async function getCalculationHistory() {
  try {
    const history = await prisma.calculation.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return history;
  } catch (error) {
    console.error('Failed to fetch calculation history:', error);
    // Return an empty array or throw a more specific error
    return [];
  }
}