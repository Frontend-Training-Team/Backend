import { Router } from 'express';
import { registerSchema, loginSchema } from '../validation/authValidation.js';
import validate from '../middleware/validationMiddleware.js';

const router = Router();


router.post('/register', validate(registerSchema), async (req, res) => {

  res.json({ message: "User registered successfully!" });
});


router.post('/login', validate(loginSchema), async (req, res) => {

  res.json({ message: "User logged in successfully!" });
});

export default router;