import type { Request, Response } from 'express';
import Categories from '../models/Category';

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Categories.find({}, '-_id');
    console.log('Fetched categories from DB:', categories);
    res.status(200).json({ message: 'Fetched successfully!', data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
