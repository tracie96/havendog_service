import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    vet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: [
            'checkup',
            'vaccination',
            'surgery',
            'dental',
            'grooming',
            'emergency',
            'other'
        ]
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Service = mongoose.model('Service', serviceSchema);

export default Service; 