import express from 'express';
import fileUpload from 'express-fileupload';
import mongoose from 'mongoose';
import config from 'config';

import cors from './middleware/cors.middleware.js';

import authRouter from './routes/auth.router.js';
import fileRouter from './routes/file.router.js';

const app = express();
const PORT = config.get('serverPort');
const DBurl = config.get('DBurl');

app.use(fileUpload({}));
app.use(cors);
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/files', fileRouter);

const start = async () => {
	try {
		await mongoose.connect(DBurl);

		app.listen(PORT, () => {
			console.log(`Server started on port ${PORT}`);
		});
	} catch (error) {
		console.log(error);
	}
};

start();
