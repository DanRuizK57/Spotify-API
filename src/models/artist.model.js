import mongoose from 'mongoose';

const ArtistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
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

const ArtistModel = mongoose.model('Artist', ArtistSchema, 'artists');

export default ArtistModel;