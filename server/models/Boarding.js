import mongoose from 'mongoose';

const boardingSchema = new mongoose.Schema({
  owner: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  pet: {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    breed: { type: String, required: true },
    allergies: { type: String },
    medications: { type: String },
    feedingInstructions: { type: String },
    specialInstructions: { type: String }
  },
  emergency_contact: {
    name: { type: String },
    phone: { type: String }
  },
  veterinarian: {
    name: { type: String },
    phone: { type: String }
  },
  boarding: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  documents: {
    petImages: [{ type: String }], // URLs to stored images
    vaccinationCard: { type: String }, // URL to stored document
    medicalRecords: { type: String } // URL to stored document
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Boarding = mongoose.model('Boarding', boardingSchema);

export default Boarding; 