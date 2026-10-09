import mongoose from 'mongoose';

const virtualAdoptionSettingsSchema = new mongoose.Schema({
    monthlyFeedPrice: {
        type: Number,
        required: true,
        default: 3000,
        min: 1
    }
});

const virtualChallengeSchema = new mongoose.Schema({
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Adoption',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const virtualSponsorshipSchema = new mongoose.Schema({
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Adoption',
        required: true
    },
    supporterName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true
    },
    monthlyFeedPrice: {
        type: Number,
        required: true
    },
    challenges: [
        {
            title: String,
            amount: Number
        }
    ],
    paymentReference: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const VirtualAdoptionSettings = mongoose.model('VirtualAdoptionSettings', virtualAdoptionSettingsSchema);
export const VirtualChallenge = mongoose.model('VirtualChallenge', virtualChallengeSchema);
export const VirtualSponsorship = mongoose.model('VirtualSponsorship', virtualSponsorshipSchema);
