import PetInterest from '../models/PetInterest.js';
import Adoption from '../models/Adoption.js';

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

        const interest = await PetInterest.findById(id);
        if (!interest) {
            return res.status(404).json({ message: 'Interest not found' });
        }

        interest.status = status;
        await interest.save();

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