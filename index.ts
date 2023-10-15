import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { AdminRoutes, VendorRoutes } from './routes';
import { MONGO_URI } from './config';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json('Hello For Food Ordering API');
});

app.use('/admin', AdminRoutes);
app.use('/vendor', VendorRoutes);

console.log(process.env.MONGO_URI);


mongoose
  .connect(MONGO_URI)
  .then(() => console.log('DataBase Connected'))
  .catch(err => console.log(err));

const port = 5000;
app.listen(port, () => {
  console.clear();
  console.log(`App is listening on the port ${port}`);
});
