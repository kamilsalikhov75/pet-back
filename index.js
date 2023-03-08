import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createUser, getUser, login } from './controllers/user-controller.js';
import checkToken from './utils/check-token.js';
import {
  createPet,
  deletePet,
  getPet,
  getPets,
  updatePet,
} from './controllers/pet-controller.js';
import fs from 'fs';
const port = process.env.PORT || 4001;
const dbUrl = process.env.DB;

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log('DB ok');
  })
  .catch((err) => console.log('DB error', err));
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: '*',
  })
);
app.use('/uploads', express.static('uploads'));

app.post('/uploads', upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post('/user/register', createUser);
app.post('/user/login', login);
app.get('/user', checkToken, getUser);

app.post('/pets', checkToken, createPet);
app.get('/pets', getPets);
app.get('/pets/:id', getPet);
app.delete('/pets/:id', checkToken, deletePet);
app.patch('/pets/:id', checkToken, updatePet);

app.listen(port, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
});
