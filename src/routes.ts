import { Router } from 'express';
import { authRouter } from './components/auth';
import { accountRouter } from './components/account';

const router = Router();

router.get('/', (req, res) => {
  return res.status(200).send({
    message: 'Live 🙂',
  });
});

router.use('/api/auth', authRouter);
router.use('/api/account', accountRouter);

export default router;
