import express from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/error-handler';
import logger from './utils/logger';
import router from './routes/reports.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;



app.use(express.json());
app.use(errorHandler);


app.use('/reports', router);

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
}); 