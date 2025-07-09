import { Router, Request, Response } from 'express';
import { getProfitLossReport, healthCheck } from '../controllers/report.controller';

const router = Router();

router.get('/', getProfitLossReport);
router.get('/health', healthCheck);

export default router;
