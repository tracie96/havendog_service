import Adoption from '../models/Adoption.js';
import {
    VirtualAdoptionSettings,
    VirtualChallenge,
    VirtualSponsorship
} from '../models/VirtualAdoption.js';
import { sendVirtualAdoptionStaffEmail } from '../utils/emailService.js';

const DEFAULT_MONTHLY_PRICE = 3000;

const getSettings = async () => {
    let settings = await VirtualAdoptionSettings.findOne();
    if (!settings) {
        settings = await VirtualAdoptionSettings.create({ monthlyFeedPrice: DEFAULT_MONTHLY_PRICE });
    }
    return settings;
};

const isInCare = (pet) => pet.status !== 'adopted' && !pet.isAdopted;

const buildDogList = (pets, challenges, monthlyFeedPrice) => {
    return pets.filter(isInCare).map((pet) => {
        const petChallenges = challenges.filter(
            (challenge) => String(challenge.pet?._id || challenge.pet) === String(pet._id) && challenge.active
        );
        const challengeTotal = petChallenges.reduce((sum, challenge) => sum + Number(challenge.amount || 0), 0);
        return {
            _id: pet._id,
            name: pet.name,
            breed: pet.breed,
            age: pet.age,
            location: pet.location,
            imageUrl: pet.imageUrl,
            description: pet.description,
            monthlyFeedPrice,
            challenges: petChallenges.map((challenge) => ({
                _id: challenge._id,
                title: challenge.title,
                description: challenge.description,
                amount: challenge.amount
            })),
            totalPrice: monthlyFeedPrice + challengeTotal
        };
    });
};

export const getPublicListing = async (req, res) => {
    try {
        const settings = await getSettings();
        const [pets, challenges] = await Promise.all([
            Adoption.find().sort({ name: 1 }),
            VirtualChallenge.find({ active: true }).sort({ createdAt: -1 })
        ]);

        res.json({
            monthlyFeedPrice: settings.monthlyFeedPrice,
            dogs: buildDogList(pets, challenges, settings.monthlyFeedPrice)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAdminOverview = async (req, res) => {
    try {
        const settings = await getSettings();
        const [pets, challenges, sponsorships] = await Promise.all([
            Adoption.find().sort({ name: 1 }),
            VirtualChallenge.find().populate('pet', 'name breed imageUrl status isAdopted').sort({ createdAt: -1 }),
            VirtualSponsorship.find().populate('pet', 'name').sort({ createdAt: -1 }).limit(50)
        ]);

        res.json({
            monthlyFeedPrice: settings.monthlyFeedPrice,
            dogs: buildDogList(pets, challenges, settings.monthlyFeedPrice),
            challenges,
            sponsorships
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateMonthlyPrice = async (req, res) => {
    try {
        const monthlyFeedPrice = Number(req.body.monthlyFeedPrice);
        if (!Number.isFinite(monthlyFeedPrice) || monthlyFeedPrice < 1) {
            return res.status(400).json({ message: 'Enter a monthly feeding price of at least ₦1.' });
        }

        const settings = await getSettings();
        settings.monthlyFeedPrice = monthlyFeedPrice;
        await settings.save();

        res.json({ monthlyFeedPrice: settings.monthlyFeedPrice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createChallenge = async (req, res) => {
    try {
        const { petId, title, description, amount } = req.body;
        const challengeAmount = Number(amount);

        if (!petId || !title?.trim()) {
            return res.status(400).json({ message: 'Choose a dog and enter a challenge title.' });
        }
        if (!Number.isFinite(challengeAmount) || challengeAmount < 1) {
            return res.status(400).json({ message: 'Enter a challenge amount greater than 0.' });
        }

        const pet = await Adoption.findById(petId);
        if (!pet || !isInCare(pet)) {
            return res.status(404).json({ message: 'That dog is not available for virtual adoption.' });
        }

        const challenge = await VirtualChallenge.create({
            pet: petId,
            title: title.trim(),
            description: description?.trim() || '',
            amount: challengeAmount
        });

        res.status(201).json(challenge);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateChallenge = async (req, res) => {
    try {
        const challenge = await VirtualChallenge.findById(req.params.id);
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found.' });
        }

        if (req.body.title !== undefined) challenge.title = String(req.body.title).trim();
        if (req.body.description !== undefined) challenge.description = String(req.body.description).trim();
        if (req.body.amount !== undefined) {
            const challengeAmount = Number(req.body.amount);
            if (!Number.isFinite(challengeAmount) || challengeAmount < 1) {
                return res.status(400).json({ message: 'Enter a challenge amount greater than 0.' });
            }
            challenge.amount = challengeAmount;
        }
        if (req.body.active !== undefined) challenge.active = Boolean(req.body.active);

        await challenge.save();
        res.json(challenge);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteChallenge = async (req, res) => {
    try {
        const challenge = await VirtualChallenge.findByIdAndDelete(req.params.id);
        if (!challenge) {
            return res.status(404).json({ message: 'Challenge not found.' });
        }
        res.json({ message: 'Challenge removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createSponsorship = async (req, res) => {
    try {
        const { petId, supporterName, email, amount, paymentReference } = req.body;
        const paidAmount = Number(amount);

        if (!petId || !supporterName?.trim() || !email?.includes('@') || !paymentReference) {
            return res.status(400).json({ message: 'Name, email, dog, and payment reference are required.' });
        }
        if (!Number.isFinite(paidAmount) || paidAmount < 1) {
            return res.status(400).json({ message: 'Payment amount is invalid.' });
        }

        const settings = await getSettings();
        const pet = await Adoption.findById(petId);
        if (!pet || !isInCare(pet)) {
            return res.status(404).json({ message: 'That dog is not available for virtual adoption.' });
        }

        const challenges = await VirtualChallenge.find({ pet: petId, active: true });
        const challengeTotal = challenges.reduce((sum, challenge) => sum + Number(challenge.amount || 0), 0);
        const expectedTotal = settings.monthlyFeedPrice + challengeTotal;

        const sponsorship = await VirtualSponsorship.create({
            pet: petId,
            supporterName: supporterName.trim(),
            email: email.trim(),
            amount: paidAmount,
            monthlyFeedPrice: settings.monthlyFeedPrice,
            challenges: challenges.map((challenge) => ({
                title: challenge.title,
                amount: challenge.amount
            })),
            paymentReference
        });

        try {
            await sendVirtualAdoptionStaffEmail(await sponsorship.populate('pet', 'name'));
        } catch (emailError) {
            console.error('Virtual adoption email failed:', emailError);
        }

        res.status(201).json({
            message: 'Virtual adoption recorded',
            sponsorship,
            expectedTotal
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
