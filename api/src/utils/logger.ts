import winston from 'winston';
import path from 'path';

const logFilePath = path.join(process.cwd(), 'files', 'logs', 'error.log');


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: logFilePath })
  ]
});

export default logger;
