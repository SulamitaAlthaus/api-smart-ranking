import mongoose from 'mongoose';

export const MatchSchema = new mongoose.Schema(
  {
    category: { type: String },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
      },
    ],
    def: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    result: [
      {
        type: Array<string>,
        ref: 'Result',
      },
    ],
  },
  { timestamps: true, collection: 'matches' },
);

export const Result = new mongoose.Schema(
  {
    set: { type: String },
  },
  { timestamps: true, collection: 'results' },
);
