import mongoose, { Schema } from 'mongoose';

const SongSchema = new mongoose.Schema(
  {
    album: {
        type: Schema.ObjectId,
        ref: "Album"
    },
    track: {
        type: Number,
        required: true
    },
    name: {
      type: String,
      required: true,
    },
    duration: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
  }
);

const SongModel = mongoose.model('Song', SongSchema, 'songs');

export default SongModel;