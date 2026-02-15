import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import Transaction from '../models/Transaction';

export const getSortingFilter = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sort } = req.query;
    const filter: Record<string, any> = { userId: req.userId };

    let sortOption: Record<string, 1 | -1> | undefined;
    if (sort === 'asc') sortOption = { amount: -1 };
    else if (sort === 'desc') sortOption = { amount: 1 };

    const transactions = await Transaction.find(filter, '-_id').sort(sortOption);
    res.status(200).json({ message: 'Fetched successfully!', data: transactions ?? [] });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter: Record<string, any> = { userId: req.userId };
    const transactions = await Transaction.find(filter, '-_id');
    res.status(200).json({ message: 'Fetched successfully!', data: transactions ?? [] });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getSingleTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    const singleTransaction = await Transaction.findOne({ id, userId: req.userId }, '-_id');

    if (!singleTransaction) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }

    res.status(200).json({ message: 'Fetched successfully!', data: singleTransaction });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getFilteredTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, category } = req.query;

    if (!type && !category) {
      res.status(400).json({ message: 'At least one filter parameter must be provided' });
      return;
    }

    if (type && type !== 'income' && type !== 'expense') {
      res.status(400).json({ message: 'Invalid.' });
      return;
    }

    const filter: Record<string, any> = { userId: req.userId };
    if (type) filter.type = type as string;
    if (category) filter.category = category as string;

    const transactions = await Transaction.find(filter, '-_id');
    res.status(200).json({ message: 'Fetched successfully!', data: transactions ?? [] });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const postTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, amount, category, date, description } = req.body;
    if (!type || !amount || !category || !date) {
      console.error('Missing required fields:', { type, amount, category, date });
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }


    // Generate a unique id per userId (guest or user)
    let nextId = 1;
    try {
      const last = await Transaction.findOne({ userId: req.userId }).sort({ id: -1 });
      nextId = last ? last.id + 1 : 1;
    } catch (findErr) {
      console.error('Error finding last transaction:', findErr);
    }

    const transaction = new Transaction({
      id: nextId,
      userId: req.userId,
      type,
      amount,
      category,
      date,
      description,
    });

    let saved = null;
    try {
      saved = await transaction.save();
      console.log('Transaction saved:', saved);
    } catch (saveErr) {
      console.error('Error saving transaction:', saveErr);
      res.status(500).json({ error: 'Failed to save transaction', details: (saveErr as Error).message });
      return;
    }

    let configuredTransaction = null;
    try {
      configuredTransaction = await Transaction.findById(saved._id, '-_id');
    } catch (configErr) {
      console.error('Error fetching saved transaction:', configErr);
    }

    if (!configuredTransaction) {
      res.status(500).json({ error: 'Transaction saved but could not be retrieved' });
      return;
    }

    res.status(201).json({ message: 'Transaction created', data: configuredTransaction });
  } catch (error) {
    console.error('Error in postTransaction:', error);
    res.status(500).json({ error: 'Internal Server Error', details: (error as Error).message });
  }
};

export const putTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string);
    const { type, amount, category, date, description } = req.body;

    if (!id || !type || !amount || !category || !date || !description) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const updatedTransaction = await Transaction.findOneAndUpdate(
      { id, userId: req.userId },
      { type, amount, category, date, description },
      { new: true }
    );

    if (!updatedTransaction) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }

    res.status(200).json({ message: 'Transaction updated successfully!', data: updatedTransaction });
  } catch (error) {
    console.error('Error editing a transaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids)) {
      res.status(400).json({ message: 'Invalid ID format' });
      return;
    }

    const deletedTransactions = await Transaction.deleteMany({
      id: { $in: ids },
      userId: req.userId,
    });

    if (deletedTransactions.deletedCount === 0) {
      res.status(404).json({ message: 'No transactions found to delete.' });
      return;
    }

    res.status(200).json({ message: 'Transaction(s) deleted successfully!', data: deletedTransactions });
  } catch (error) {
    console.error('Error deleting a transaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
