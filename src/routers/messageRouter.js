import { Router } from 'express';
import passport from 'passport';

import messageController from '../controllers/messageController.js';
import { authorization } from '../middlewares/auth.js';

const router = Router();

router.get('/', passport.authenticate("jwt", { session: false }), authorization('User'), messageController.renderMessage);

export default router;