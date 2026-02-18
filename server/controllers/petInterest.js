import PetInterest from '../models/PetInterest.js';
import Adoption from '../models/Adoption.js';
import { sendAdoptionStatusEmail } from '../utils/emailService.js';

export const expressInterest = async (req, res) => {
    try {
        console.log('here');
        const {
            petId,
            fullName,
            phoneNumber,
            emailAddress,
            homeAddress,
            occupation,
            workSchedule,
            // Living Situation
            accommodationType,
            ownershipType,
            petOwnershipAllowed,
            fencedYard,
            householdMembers,
            // Pet Experience
            ownedDogBefore,
            previousPetOutcome,
            currentlyHavePets,
            currentPetsDetails,
            currentPetsSterilized,
            // Lifestyle & Commitment
            adoptionReason,
            primaryCaregiver,
            hoursAloneDaily,
            sleepingLocation,
            travelManagement,
            lifetimeCommitment,
            // Health & Responsibility
            willingToVaccinate,
            willingToProvideVetCare,
            willingToUseFleaPrevention,
            willingToSterilize,
            preferredVeterinarian,
            // Financial Readiness
            financiallyPrepared,
            // Dog-Specific Questions
            petApplyingFor,
            openToFosterToAdopt,
            agreeNotToRehome,
            willReturnToShelter,
            // Agreement Section
            confirmInformationAccurate,
            understandSelectiveProcess,
            agreeToHomeCheck,
            agreeToAdoptionContract,
            // Legacy fields (for backward compatibility)
            interestedUser,
            message
        } = req.body;

        // Check if the pet exists
        const pet = await Adoption.findById(petId);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        // Convert hoursAloneDaily to number if it's a string
        const hoursAloneDailyNum = typeof hoursAloneDaily === 'string' 
            ? parseInt(hoursAloneDaily, 10) 
            : hoursAloneDaily;

        // Create new interest with all fields
        const interestData = {
            petId,
            // Basic Information
            fullName,
            phoneNumber,
            emailAddress,
            homeAddress,
            occupation,
            workSchedule,
            // Living Situation
            accommodationType,
            ownershipType,
            fencedYard,
            householdMembers,
            // Pet Experience
            ownedDogBefore,
            currentlyHavePets,
            // Lifestyle & Commitment
            adoptionReason,
            primaryCaregiver,
            hoursAloneDaily: hoursAloneDailyNum,
            sleepingLocation,
            travelManagement,
            lifetimeCommitment,
            // Health & Responsibility
            willingToVaccinate,
            willingToProvideVetCare,
            willingToUseFleaPrevention,
            willingToSterilize,
            // Financial Readiness
            financiallyPrepared,
            // Dog-Specific Questions
            petApplyingFor: petApplyingFor || pet.name,
            openToFosterToAdopt,
            agreeNotToRehome,
            willReturnToShelter,
            // Agreement Section
            confirmInformationAccurate,
            understandSelectiveProcess,
            agreeToHomeCheck,
            agreeToAdoptionContract,
            status: 'pending'
        };

        // Add conditional fields
        if (ownershipType === 'rent') {
            interestData.petOwnershipAllowed = petOwnershipAllowed;
        }

        if (ownedDogBefore === 'yes') {
            interestData.previousPetOutcome = previousPetOutcome;
        }

        if (currentlyHavePets === 'yes') {
            interestData.currentPetsDetails = currentPetsDetails;
            interestData.currentPetsSterilized = currentPetsSterilized;
        }

        if (preferredVeterinarian) {
            interestData.preferredVeterinarian = preferredVeterinarian;
        }

        // Always populate legacy fields for backward compatibility
        // Use provided legacy fields if available, otherwise populate from new fields
        interestData.interestedUser = interestedUser || {
            name: fullName,
            email: emailAddress,
            phone: phoneNumber
        };
        interestData.message = message || adoptionReason || '';

        const interest = new PetInterest(interestData);
        await interest.save();

        res.status(201).json({
            message: 'Expression of Interest submitted successfully',
            interest
        });
    } catch (error) {
        console.error('Error creating interest:', error);
        res.status(500).json({ 
            message: error.message || 'Failed to submit expression of interest',
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const getInterestsByPet = async (req, res) => {
    try {
        const { petId } = req.params;
        const interests = await PetInterest.find({ petId })
            .sort({ createdAt: -1 });

        res.json(interests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateInterestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be approved, rejected, or pending' });
        }

        const interest = await PetInterest.findById(id).populate('petId', 'name breed');
        if (!interest) {
            return res.status(404).json({ message: 'Interest not found' });
        }

        const oldStatus = interest.status;
        interest.status = status;
        await interest.save();

        // Send email notification if status changed to approved or rejected
        if ((status === 'approved' || status === 'rejected') && oldStatus !== status) {
            try {
                // Support both new and legacy field structures
                const email = interest.emailAddress || interest.interestedUser?.email;
                const name = interest.fullName || interest.interestedUser?.name;
                
                if (email && name) {
                    await sendAdoptionStatusEmail({
                        to: email,
                        name: name,
                        petName: interest.petId?.name || 'the pet',
                        status: status
                    });
                }
            } catch (emailError) {
                // Log email error but don't fail the request
                console.error('Failed to send email notification:', emailError);
            }
        }

        res.json({
            message: 'Interest status updated successfully',
            interest
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllInterests = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        
        if (status) {
            query.status = status;
        }

        const interests = await PetInterest.find(query)
            .sort({ createdAt: -1 })
            .populate('petId', 'name type breed');

        res.json(interests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 