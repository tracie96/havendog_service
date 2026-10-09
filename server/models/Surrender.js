import mongoose from 'mongoose';

const surrenderSchema = new mongoose.Schema({
  surrenderer: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String },
    email: { type: String, required: true },
    residentialAddress: { type: String, required: true },
    occupation: { type: String },
    nextOfKin: { type: String },
    nextOfKinPhone: { type: String },
    nextOfKinRelationship: { type: String }
  },
  pet: {
    name: { type: String, required: true },
    species: { type: String, enum: ['dog', 'cat', 'other'], required: true },
    speciesOther: { type: String },
    breed: { type: String },
    sex: { type: String, enum: ['male', 'female'] },
    age: { type: String },
    dateOfBirth: { type: String },
    colourMarkings: { type: String },
    microchipNumber: { type: String },
    currentLocation: { type: String }
  },
  reason: {
    reasons: [{ type: String }],
    otherReason: { type: String },
    explanation: { type: String }
  },
  medical: {
    vaccinated: { type: String, enum: ['yes', 'no', 'unknown'] },
    lastVaccinationDate: { type: String },
    rabiesVaccinated: { type: String, enum: ['yes', 'no', 'unknown'] },
    onTickMedicine: { type: String, enum: ['yes', 'no', 'unknown'] },
    sterilized: { type: String, enum: ['yes', 'no'] },
    hadLitter: { type: String, enum: ['yes', 'no'] },
    knownConditions: { type: String },
    currentMedications: { type: String },
    knownAllergies: { type: String },
    lastVetVisit: { type: String },
    vetClinic: { type: String }
  },
  behaviour: {
    friendlyWithPeople: { type: String, enum: ['yes', 'no', 'sometimes'] },
    friendlyWithChildren: { type: String, enum: ['yes', 'no', 'unknown'] },
    friendlyWithDogs: { type: String, enum: ['yes', 'no', 'unknown'] },
    friendlyWithCats: { type: String, enum: ['yes', 'no', 'unknown'] },
    hasBitten: { type: String, enum: ['yes', 'no'] },
    biteExplanation: { type: String },
    fearAnxietyAggression: { type: String },
    houseTrained: { type: String, enum: ['yes', 'no', 'unknown'] }
  },
  care: {
    currentFood: { type: String },
    mealsPerDay: { type: String },
    foodRestrictions: { type: String },
    specialCare: { type: String }
  },
  declaration: {
    legalOwnerConfirmed: { type: Boolean, required: true },
    voluntarySurrenderConfirmed: { type: Boolean, required: true },
    informationAccurate: { type: Boolean, required: true },
    termsUnderstood: { type: Boolean, required: true },
    ownershipTransferConfirmed: { type: Boolean, required: true },
    surrendererName: { type: String, required: true },
    signature: { type: String, required: true },
    date: { type: Date, required: true }
  },
  contribution: {
    choice: { type: String, enum: ['tip', 'food'], required: true },
    amount: { type: Number },
    paymentReference: { type: String }
  },
  havenAcceptance: {
    acceptedBy: { type: String },
    position: { type: String },
    signature: { type: String },
    date: { type: Date },
    animalId: { type: String }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Surrender = mongoose.model('Surrender', surrenderSchema);

export default Surrender;
