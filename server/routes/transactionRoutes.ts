import { Router } from 'express';
import type { AuthRequest } from '../middleware/auth';
import {
  getTransactions,
  getSingleTransaction,
  getFilteredTransactions,
  getSortingFilter,
  postTransaction,
  putTransaction,
  deleteTransaction,
} from '../controllers/transactionController';

const router = Router();

router.get('/', (req, res, next) => {
  const { sort, type, category } = req.query;
  const authReq = req as AuthRequest;

  if (sort) return getSortingFilter(authReq, res);
  if (type || category) return getFilteredTransactions(authReq, res);
  return getTransactions(authReq, res);
});

router.get('/:id', (req, res) => getSingleTransaction(req as unknown as AuthRequest, res));
router.post('/', (req, res) => postTransaction(req as AuthRequest, res));
router.put('/:id', (req, res) => putTransaction(req as unknown as AuthRequest, res));
router.delete('/', (req, res) => deleteTransaction(req as AuthRequest, res));

export default router;
