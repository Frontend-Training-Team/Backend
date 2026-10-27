import { Router } from 'express';
import { registerValidation, loginValidation } from '../validations/authValidation.js';
import validate from '../middlewares/validationMiddleware.js';

const router = Router();

// راوت التسجيل مع الميدلوير
router.post('/register', validate(registerValidation), async (req, res) => {
    // منطق الـ Controller للتسجيل
    res.json({ message: "User registered successfully!" });
});

// راوت تسجيل الدخول مع الميدلوير
router.post('/login', validate(loginValidation), async (req, res) => {
    // منطق الـ Controller لتسجيل الدخول
    res.json({ message: "User logged in successfully!" });
});

export default router;