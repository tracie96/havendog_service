import Surrender from '../models/Surrender.js';
import { sendSurrenderRequestStaffEmail } from '../utils/emailService.js';

export const createSurrenderSubmission = async (req, res) => {
    try {
        const {
            surrenderer,
            pet,
            reason,
            medical,
            behaviour,
            care,
            declaration
        } = req.body;

        if (
            !declaration?.legalOwnerConfirmed ||
            !declaration?.voluntarySurrenderConfirmed ||
            !declaration?.informationAccurate ||
            !declaration?.termsUnderstood ||
            !declaration?.ownershipTransferConfirmed
        ) {
            return res.status(400).json({
                message: 'Please complete all surrender declaration confirmations.'
            });
        }

        if (!declaration?.surrendererName || !declaration?.signature || !declaration?.date) {
            return res.status(400).json({
                message: 'Please provide the surrenderer’s name, signature, and date.'
            });
        }

        const submission = new Surrender({
            surrenderer,
            pet,
            reason,
            medical,
            behaviour,
            care,
            declaration
        });

        await submission.save();

        await sendSurrenderRequestStaffEmail(submission);

        res.status(201).json({
            message: 'Pet surrender form submitted successfully',
            submission
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSurrenderSubmissions = async (req, res) => {
    try {
        const { status } = req.query;
        const query = status ? { status } : {};
        const submissions = await Surrender.find(query).sort({ createdAt: -1 });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSurrenderSubmissionById = async (req, res) => {
    try {
        const submission = await Surrender.findById(req.params.id);
        if (!submission) {
            return res.status(404).json({ message: 'Surrender submission not found' });
        }
        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSurrenderStatus = async (req, res) => {
    try {
        const { status, havenAcceptance } = req.body;
        const submission = await Surrender.findById(req.params.id);

        if (!submission) {
            return res.status(404).json({ message: 'Surrender submission not found' });
        }

        if (status) {
            submission.status = status;
        }

        if (havenAcceptance) {
            submission.havenAcceptance = {
                ...submission.havenAcceptance?.toObject?.() || {},
                ...havenAcceptance
            };
        }

        await submission.save();

        res.json({
            message: 'Surrender updated successfully',
            submission
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
