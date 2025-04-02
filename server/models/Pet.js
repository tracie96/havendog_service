import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['dog', 'cat', 'bird', 'fish', 'other']
    },
    breed: {
        type: String,
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'unknown'],
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    pictures: [{
        type: String
    }],
    medicalHistory: [{
        date: Date,
        description: String,
        vet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    vaccinations: [{
        name: String,
        date: Date,
        nextDueDate: Date,
        administeredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    specialNeeds: [{
        type: String,
        description: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Pet = mongoose.model('Pet', petSchema);

export default Pet; 