import mongoose from 'mongoose';

const adoptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    breed: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true // total age in months (e.g. 36 = 36 months)
    },
    status: {
        type: String,
        enum: ['available', 'pending', 'adopted'],
        default: 'available'
    },
    isAdopted: {
        type: Boolean,
        default: false
    },
    adopterName: {
        type: String,
        trim: true
    },
    adopterPhone: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Adoption = mongoose.model('Adoption', adoptionSchema);

export default Adoption; 