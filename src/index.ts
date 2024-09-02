import express from 'express';
import cors from 'cors';
import { scheduleRoute } from './routes/schedule';

const server = express();

server.use(express.json());
server.use(cors({ origin: '*' }));

server.use('/notifications', scheduleRoute);

server.listen(7777, () => {
  console.log(`Server is started at: ${7777}`);
});
