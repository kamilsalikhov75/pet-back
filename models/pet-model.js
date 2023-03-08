import mongoose from 'mongoose';

const PetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  kind: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  shortDesc: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  shelter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export const PetModel = mongoose.model('Pet', PetSchema);
