import mongoose from 'mongoose';
const { Schema, model, ObjectId } = mongoose;

const File = new Schema({
	name: { type: String, required: true },
	type: { type: String, required: true },
	accessLink: { type: String },
	size: { type: Number, default: 0 },
	date: { type: Date, default: Date.now() },
	path: { type: String, default: '' },
	user: { type: ObjectId, ref: 'User' },
	parent: { type: ObjectId, ref: 'File' },
	children: [{ type: ObjectId, ref: 'File' }],
});

export default model('File', File);
