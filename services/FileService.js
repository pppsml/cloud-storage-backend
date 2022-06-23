import fs from 'fs';
import config from 'config';

import File from '../models/File.js';

class FileService {
	createDir(file) {
		const filePath = `${config.get('filePath')}\\${file.user}\\${file.path}`;
		return new Promise((resolve, reject) => {
			try {
				if (fs.mkdirSync(filePath, { recursive: true })) {
					fs.mkdirSync(filePath, { recursive: true });
					return resolve({ message: 'File was created' });
				} else {
					return reject({ message: 'File already exist' });
				}
			} catch (error) {
				return reject({ message: 'File error' });
			}
		});
	}

	deleteFile(file) {
		const path = this.getPath(file);
		if (file.type === 'dir') {
			fs.rmdirSync(path);
		} else {
			fs.unlinkSync(path);
		}
	}

	getPath(file) {
		return `${config.get('filePath')}\\${file.user}\\${file.path}`;
	}
}

export default new FileService();
