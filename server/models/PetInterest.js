import mongoose from 'mongoose';

const petInterestSchema = new mongoose.Schema({
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Adoption',
        required: true
    },
    // Basic Information
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    emailAddress: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    homeAddress: {
        type: String,
        required: true,
        trim: true
    },
    occupation: {
        type: String,
        required: true,
        trim: true
    },
    workSchedule: {
        type: String,
        required: true,
        enum: ['9-5', 'remote', 'shift-work', 'flexible', 'unemployed', 'retired', 'other']
    },
    // Living Situation
    accommodationType: {
        type: String,
        required: true,
        enum: ['apartment', 'detached-house', 'shared-accommodation']
    },
    ownershipType: {
        type: String,
        required: true,
        enum: ['own', 'rent']
    },
    petOwnershipAllowed: {
        type: String,
        enum: ['yes', 'no'],
        required: function() {
            return this.ownershipType === 'rent';
        }
    },
    fencedYard: {
        type: String,
        required: true,
        enum: ['yes', 'no']
    },
    householdMembers: {
        type: String,
        required: true,
        trim: true
    },
    // Pet Experience
    ownedDogBefore: {
        type: String,
        required: true,
        enum: ['yes', 'no']
    },
    previousPetOutcome: {
        type: String,
        trim: true,
        required: function() {
            return this.ownedDogBefore === 'yes';
        }
    },
    currentlyHavePets: {
        type: String,
        required: true,
        enum: ['yes', 'no']
    },
    currentPetsDetails: {
        type: String,
        trim: true,
        required: function() {
            return this.currentlyHavePets === 'yes';
        }
    },
    currentPetsSterilized: {
        type: String,
        enum: ['yes', 'no', 'some'],
        required: function() {
            return this.currentlyHavePets === 'yes';
        }
    },
    // Lifestyle & Commitment
    adoptionReason: {
        type: String,
        required: true,
        trim: true
    },
    primaryCaregiver: {
        type: String,
        required: true,
        trim: true
    },
    hoursAloneDaily: {
        type: Number,
        required: true,
        min: 0,
        max: 24,
        set: function(v) {
            // Convert string to number if needed
            return typeof v === 'string' ? parseInt(v, 10) : v;
        }
    },
    sleepingLocation: {
        type: String,
        required: true,
        enum: ['inside-house', 'bedroom', 'living-room', 'crate-inside', 'other']
    },
    travelManagement: {
        type: String,
        required: true,
        trim: true
    },
    lifetimeCommitment: {
        type: String,
        required: true,
        enum: ['yes', 'unsure', 'no']
    },
    // Health & Responsibility
    willingToVaccinate: {
        type: String,
        required: true,
        enum: ['yes', 'no']
    },
    willingToProvideVetCare: {
        type: String,
        required: true,
        enum: ['yes', 'no']
    },
    willingToUseFleaPrevention: {
        type: String,
        required: true,
        enum: ['yes', 'no']
    },
    willingToSterilize: {
        type: String,
        required: true,
        enum: ['yes', 'no']
    },
    preferredVeterinarian: {
        type: String,
        trim: true
    },
    // Financial Readiness
    financiallyPrepared: {
        type: [String],
        required: true,
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'Please select at least one financial preparation option'
        }
    },
    // Dog-Specific Questions
    petApplyingFor: {
        type: String,
        trim: true
    },
    openToFosterToAdopt: {
        type: String,
        required: true,
        enum: ['yes', 'no', 'maybe']
    },
    agreeNotToRehome: {
        type: String,
        required: true,
        enum: ['yes', 'no']
    },
    willReturnToShelter: {
        type: String,
        required: true,
        enum: ['yes', 'no']
    },
    // Agreement Section
    confirmInformationAccurate: {
        type: Boolean,
        required: true,
        default: false
    },
    understandSelectiveProcess: {
        type: Boolean,
        required: true,
        default: false
    },
    agreeToHomeCheck: {
        type: Boolean,
        required: true,
        default: false
    },
    agreeToAdoptionContract: {
        type: Boolean,
        required: true,
        default: false
    },
    // Legacy fields for backward compatibility (optional)
    interestedUser: {
        name: {
            type: String,
            required: false,
            trim: true
        },
        email: {
            type: String,
            required: false,
            trim: true,
            lowercase: true
        },
        phone: {
            type: String,
            required: false,
            trim: true
        }
    },
    message: {
        type: String,
        required: false,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

petInterestSchema.pre('save', function(next) {
    if (!this.interestedUser || !this.interestedUser.name) {
        if (!this.interestedUser) {
            this.interestedUser = {};
        }
        if (this.fullName) {
            this.interestedUser.name = this.fullName;
        }
        if (this.emailAddress) {
            this.interestedUser.email = this.emailAddress;
        }
        if (this.phoneNumber) {
            this.interestedUser.phone = this.phoneNumber;
        }
    }
    
    if (!this.message && this.adoptionReason) {
        this.message = this.adoptionReason;
    }
    
    next();
});

const PetInterest = mongoose.model('PetInterest', petInterestSchema);

export default PetInterest; 