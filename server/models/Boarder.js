import mongoose from 'mongoose';

const boarderSchema = new mongoose.Schema({
  nameOfBreed: {
    type: String,
    required: true,
    trim: true
  },
  ownerInformation: {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true }
  },
  priceAgreed: {
    type: Number,
    required: true,
    min: 0
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkoutDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Boarder = mongoose.model('Boarder', boarderSchema);

export default Boarder;
