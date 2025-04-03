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
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'pending', 'adopted'],
        default: 'available'
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