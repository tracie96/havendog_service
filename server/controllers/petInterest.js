import PetInterest from '../models/PetInterest.js';
import Adoption from '../models/Adoption.js';
import { sendAdoptionStatusEmail, sendInterestStaffEmail } from '../utils/emailService.js';

export const expressInterest = async (req, res) => {
    try {
        const {
            petId,
            interestType = 'adoption',
            fosterDuration,
            fullName,
            phoneNumber,
            emailAddress,
            homeAddress,
            occupation,
            workSchedule,
            accommodationType,
            ownershipType,
            petOwnershipAllowed,
            fencedYard,
            householdMembers,
            ownedDogBefore,
            previousPetOutcome,
            currentlyHavePets,
            currentPetsDetails,
            currentPetsSterilized,
            adoptionReason,
            primaryCaregiver,
            hoursAloneDaily,
            sleepingLocation,
            travelManagement,
            lifetimeCommitment,
            willingToVaccinate,
            willingToProvideVetCare,
            willingToUseFleaPrevention,
            willingToSterilize,
            preferredVeterinarian,
            financiallyPrepared,
            petApplyingFor,
            openToFosterToAdopt,
            agreeNotToRehome,
            willReturnToShelter,
            confirmInformationAccurate,
            understandSelectiveProcess,
            agreeToHomeCheck,
            agreeToAdoptionContract,
            interestedUser,
            message
        } = req.body;

        if (!['adoption', 'foster'].includes(interestType)) {
            return res.status(400).json({ message: 'Interest type must be adoption or foster' });
        }

        if (!fullName || !phoneNumber || !emailAddress || !homeAddress) {
            return res.status(400).json({
                message: 'Full name, phone number, email address, and home address are required.'
            });
        }

        if (!confirmInformationAccurate) {
            return res.status(400).json({
                message: 'Please confirm that the information provided is accurate.'
            });
        }

        const pet = await Adoption.findById(petId);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        const interestData = {
            petId,
            interestType,
            fullName,
            phoneNumber,
            emailAddress,
            homeAddress,
            confirmInformationAccurate,
            petApplyingFor: petApplyingFor || pet.name,
            status: 'pending',
            interestedUser: interestedUser || {
                name: fullName,
                email: emailAddress,
                phone: phoneNumber
            },
            message: message || adoptionReason || (interestType === 'foster' ? 'Foster interest (2 weeks)' : '')
        };

        if (interestType === 'foster') {
            interestData.fosterDuration = fosterDuration || '2-weeks';
        } else {
            const hoursAloneDailyNum = typeof hoursAloneDaily === 'string'
                ? parseInt(hoursAloneDaily, 10)
                : hoursAloneDaily;

            Object.assign(interestData, {
                occupation,
                workSchedule,
                accommodationType,
                ownershipType,
                fencedYard,
                householdMembers,
                ownedDogBefore,
                currentlyHavePets,
                adoptionReason,
                primaryCaregiver,
                hoursAloneDaily: hoursAloneDailyNum,
                sleepingLocation,
                travelManagement,
                lifetimeCommitment,
                willingToVaccinate,
                willingToProvideVetCare,
                willingToUseFleaPrevention,
                willingToSterilize,
                financiallyPrepared,
                openToFosterToAdopt,
                agreeNotToRehome,
                willReturnToShelter,
                understandSelectiveProcess,
                agreeToHomeCheck,
                agreeToAdoptionContract
            });

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
        }

        const interest = new PetInterest(interestData);
        await interest.save();

        await interest.populate('petId', 'name breed');
        await sendInterestStaffEmail(interest);

        res.status(201).json({
            message: interestType === 'foster'
                ? 'Foster interest submitted successfully'
                : 'Expression of Interest submitted successfully',
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

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be approved, rejected, or pending' });
        }

        const existing = await PetInterest.findById(id).select('status emailAddress fullName interestedUser interestType').populate('petId', 'name breed');
        if (!existing) {
            return res.status(404).json({ message: 'Interest not found' });
        }

        const oldStatus = existing.status;
        const interest = await PetInterest.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: false }
        ).populate('petId', 'name breed');

        // Adoption interview emails only for adoption requests
        if (
            interest.interestType !== 'foster' &&
            (status === 'approved' || status === 'rejected') &&
            oldStatus !== status
        ) {
            try {
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
        const { status, interestType } = req.query;
        let query = {};

        if (status) {
            query.status = status;
        }
        if (interestType) {
            query.interestType = interestType;
        }

        const interests = await PetInterest.find(query)
            .sort({ createdAt: -1 })
            .populate('petId', 'name type breed');

        res.json(interests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
