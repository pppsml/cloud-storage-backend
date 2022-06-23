import jwt from 'jsonwebtoken';
import config from 'config';

export default function authMiddleware(req, res, next) {
	if (req.method === 'OPTIONS') {
		return next();
	}

	try {
		const token = req.headers.authorization.split(' ')[1];
		if (!token) {
			res.status(401).json({ message: 'Auth error' });
		}
		const decoded = jwt.verify(token, config.get('secretKey'));
		req.user = decoded;
		next();
	} catch (error) {
		res.status(401).json({ message: 'Auth error' });
	}
}
