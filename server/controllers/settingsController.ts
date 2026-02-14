import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth';
import Settings from '../models/Settings';

export const getSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentSettings = await Settings.find({ userId: req.userId }, '-_id');
    res.status(200).json({ message: 'Fetched successfully!', data: currentSettings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const putSettings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { darkMode } = req.body;

    if (typeof darkMode !== 'boolean') {
      res.status(400).json({ message: 'Invalid value for darkMode. Expected true or false.' });
      return;
    }

    const editedSettings = await Settings.findOneAndUpdate(
      { userId: req.userId },
      { darkMode },
      { new: true }
    );

    if (!editedSettings) {
      const newSettings = await Settings.create({ userId: req.userId, darkMode });
      res.status(201).json({ message: 'Settings created successfully!', data: newSettings });
      return;
    }

    res.status(200).json({ message: 'Settings updated successfully!', data: editedSettings });
  } catch (error) {
    console.error('Error editing settings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
