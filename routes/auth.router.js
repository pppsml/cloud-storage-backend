import { Router } from 'express';
import bcrypt from 'bcrypt';
import config from 'config';
import { check, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import authMiddleware from '../middleware/auth.middleware.js';

import FileService from '../services/FileService.js';

import File from '../models/File.js';
import User from '../models/User.js';

const authRouter = new Router();

authRouter.post(
	'/registration',
	[
		check('email', 'Uncorrect email').isEmail(),
		check('password', 'Password must be longer than 3 and shorter than 12 characters').isLength({
			min: 3,
			max: 12,
		}),
	],
	async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ message: 'Uncorrect request', errors });
			}

			const { email, password } = req.body;
			const candidate = await User.findOne({ email });

			if (candidate) {
				return res.status(400).json({ message: `User with email ${email} already exist` });
			}

			const hashPassword = await bcrypt.hash(password, 8);
			const user = new User({ email, password: hashPassword });
			await user.save();
			await FileService.createDir(new File({ user: user.id, name: '' }));
			return res.json({ message: 'User was created' });
		} catch (error) {
			console.log(error);
			res.send({ message: 'Registration error' });
		}
	},
);

authRouter.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		const isPassValid = bcrypt.compareSync(password, user.password);
		if (!isPassValid) {
			return res.status(400).json({ message: 'Invalid password' });
		}

		const token = jwt.sign({ id: user.id }, config.get('secretKey'), { expiresIn: '1h' });
		return res.json({
			token,
			user: {
				id: user.id,
				email: user.email,
				diskSpace: user.diskSpace,
				usedSpace: user.usedSpace,
				avatar: user.avatar,
			},
		});
	} catch (error) {
		console.log(error);
		res.send({ message: 'Login error' });
	}
});

authRouter.get('/auth', authMiddleware, async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.user.id });

		const token = jwt.sign({ id: user.id }, config.get('secretKey'), { expiresIn: '1h' });
		return res.json({
			token,
			user: {
				id: user.id,
				email: user.email,
				diskSpace: user.diskSpace,
				usedSpace: user.usedSpace,
				avatar: user.avatar,
			},
		});
	} catch (error) {
		console.log(error);
		res.send({ message: 'Auth error' });
	}
});

export default authRouter;
