import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import FileController from '../controllers/FileController.js';

const fileRouter = new Router();

fileRouter.post('', authMiddleware, FileController.createDir);
fileRouter.post('/upload', authMiddleware, FileController.uploadFile);
fileRouter.get('', authMiddleware, FileController.getFiles);
fileRouter.get('/download', authMiddleware, FileController.downloadFile);
fileRouter.delete('/', authMiddleware, FileController.deleteFile);

export default fileRouter;
