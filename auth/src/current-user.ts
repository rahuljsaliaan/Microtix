import express from 'express';
import { body } from 'express-validator';

const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
  res.send('Hi there!');
});

export { router as currentUserRouter };
