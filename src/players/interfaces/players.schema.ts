import * as mongoose from 'mongoose';

export const PlayerSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    phone: { type: String },
    name: String,
    ranking: String,
    position: Number,
    urlPofilePicture: String,
  },
  { timestamps: true, collection: 'Players' },
);
