import mongoose, { Schema } from 'mongoose';

const AlbumSchema = new mongoose.Schema(
  {
    artist: {
        type: Schema.ObjectId,
        ref: "Artist"
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    year: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        default: "default.png"
    },
    created_at: {
        type: Date,
        default: Date.now
    },
  }
);

const AlbumModel = mongoose.model('Album', AlbumSchema, 'albums');

export default AlbumModel;