import PetInterest from '../models/PetInterest.js';
import Adoption from '../models/Adoption.js';
import { sendAdoptionStatusEmail } from '../utils/emailService.js';

export const expressInterest = async (req, res) => {
    try {
        const { petId, interestedUser, message } = req.body;

        // Check if the pet exists
        const pet = await Adoption.findById(petId);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        // Create new interest
        const interest = new PetInterest({
            petId,
            interestedUser,
            message,
            status: 'pending'
        });

        await interest.save();

        res.status(201).json({
            message: 'Interest expressed successfully',
            interest
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
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
                await sendAdoptionStatusEmail({
                    to: interest.interestedUser.email,
                    name: interest.interestedUser.name,
                    petName: interest.petId?.name || 'the pet',
                    status: status
                });
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