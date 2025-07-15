import Boarding from '../models/Boarding.js';

export const createBoardingSubmission = async (req, res) => {
    try {
        const {
            owner,
            pet,
            emergency_contact,
            veterinarian,
            boarding,
            documents
        } = req.body;

        const boardingSubmission = new Boarding({
            owner,
            pet,
            emergency_contact,
            veterinarian,
            boarding,
            documents
        });

        await boardingSubmission.save();

        res.status(201).json({
            message: 'Boarding submission created successfully',
            submission: boardingSubmission
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getBoardingSubmissions = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        
        if (status) {
            query.status = status;
        }

        const submissions = await Boarding.find(query)
            .sort({ createdAt: -1 });

        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getBoardingSubmissionById = async (req, res) => {
    try {
        const { id } = req.params;
        const submission = await Boarding.findById(id);
        
        if (!submission) {
            return res.status(404).json({ message: 'Boarding submission not found' });
        }

        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateBoardingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const submission = await Boarding.findById(id);
        if (!submission) {
            return res.status(404).json({ message: 'Boarding submission not found' });
        }

        submission.status = status;
        await submission.save();

        res.json({
            message: 'Boarding status updated successfully',
            submission
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 