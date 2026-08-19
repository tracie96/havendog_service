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
    lastVaccinated: { type: String, enum: ['yes', 'no'] },
    onTickMedicine: { type: String, enum: ['yes', 'no'] },
    dogSize: { type: String, enum: ['small', 'medium', 'large'] },
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
  },
  agreedToBoardingTerms: {
    type: Boolean,
    required: true,
    default: false
  },
  confirmedInformationAccurate: {
    type: Boolean,
    required: true,
    default: false
  },
  ownerDeclaration: {
    ownerName: { type: String },
    signature: { type: String },
    date: { type: Date }
  },
  termsAgreedAt: {
    type: Date
  }
});

const Boarding = mongoose.model('Boarding', boardingSchema);

export default Boarding; 