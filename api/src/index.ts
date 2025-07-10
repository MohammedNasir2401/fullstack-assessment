import express from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/error-handler';
import logger from './utils/logger';
import reportRoutes from './routes/report.routes';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;



app.use(express.json());
app.use(errorHandler);
app.use(cors());


app.use('/report/', reportRoutes);

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
}); 