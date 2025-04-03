import Adoption from '../models/Adoption.js';

// Create a new adoption listing
export const createAdoption = async (req, res) => {
    try {
        const { name, breed, age, location, imageUrl, description } = req.body;
        const postedBy = req.user.userId;

        const adoption = new Adoption({
            name,
            breed,
            age,
            location,
            imageUrl,
            description,
            postedBy
        });

        await adoption.save();
        res.status(201).json(adoption);
    } catch (error) {
        res.status(500).json({ message: 'Error creating adoption listing', error: error.message });
    }
};

// Get all adoption listings
export const getAllAdoptions = async (req, res) => {
    try {
        const adoptions = await Adoption.find()
            .populate('postedBy', 'firstName lastName email')
            .sort({ createdAt: -1 });
        res.json(adoptions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching adoption listings', error: error.message });
    }
};

// Get adoption by ID
export const getAdoptionById = async (req, res) => {
    try {
        const adoption = await Adoption.findById(req.params.id)
            .populate('postedBy', 'firstName lastName email');
        
        if (!adoption) {
            return res.status(404).json({ message: 'Adoption listing not found' });
        }
        
        res.json(adoption);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching adoption listing', error: error.message });
    }
};

// Update adoption status
export const updateAdoptionStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const adoption = await Adoption.findById(req.params.id);

        if (!adoption) {
            return res.status(404).json({ message: 'Adoption listing not found' });
        }

        // Check if user is the owner of the listing
        if (adoption.postedBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to update this listing' });
        }

        adoption.status = status;
        await adoption.save();

        res.json(adoption);
    } catch (error) {
        res.status(500).json({ message: 'Error updating adoption status', error: error.message });
    }
};

// Delete adoption listing
export const deleteAdoption = async (req, res) => {
    try {
        const adoption = await Adoption.findById(req.params.id);

        if (!adoption) {
            return res.status(404).json({ message: 'Adoption listing not found' });
        }

        // Check if user is the owner of the listing
        if (adoption.postedBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this listing' });
        }

        await adoption.remove();
        res.json({ message: 'Adoption listing deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting adoption listing', error: error.message });
    }
};

// Get adoptions by location
export const getAdoptionsByLocation = async (req, res) => {
    try {
        const { location } = req.params;
        const adoptions = await Adoption.find({ 
            location: { $regex: location, $options: 'i' },
            status: 'available'
        })
        .populate('postedBy', 'firstName lastName email')
        .sort({ createdAt: -1 });
        
        res.json(adoptions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching adoptions by location', error: error.message });
    }
};

// Get adoptions by breed
export const getAdoptionsByBreed = async (req, res) => {
    try {
        const { breed } = req.params;
        const adoptions = await Adoption.find({ 
            breed: { $regex: breed, $options: 'i' },
            status: 'available'
        })
        .populate('postedBy', 'firstName lastName email')
        .sort({ createdAt: -1 });
        
        res.json(adoptions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching adoptions by breed', error: error.message });
    }
}; 