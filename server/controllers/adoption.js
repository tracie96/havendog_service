import Adoption from '../models/Adoption.js';

// Create a new adoption listing
export const createAdoption = async (req, res) => {
    try {
        const { name, breed, age, location, imageUrl, description } = req.body;
        // Use default ID instead of requiring user authentication
        const postedBy = "67ed8887f483b67ee96b16c2"; // Default user ID

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
        console.log('✅ getAllAdoptions function called');
        console.log('Request URL:', req.url);
        console.log('Request Method:', req.method);
        const adoptions = await Adoption.find()
            .populate('postedBy', 'firstName lastName email')
            .sort({ createdAt: -1 });
        console.log(`Found ${adoptions.length} adoptions`);
        res.json(adoptions);
    } catch (error) {
        console.error('❌ Error in getAllAdoptions:', error);
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

// Update adoption listing
export const updateAdoption = async (req, res) => {
    try {
        const { name, breed, age, location, imageUrl, description, status, isAdopted } = req.body;
        const adoption = await Adoption.findById(req.params.id);

        if (!adoption) {
            return res.status(404).json({ message: 'Adoption listing not found' });
        }

        // Authentication check removed - anyone can update

        // Update fields if provided
        if (name !== undefined) adoption.name = name;
        if (breed !== undefined) adoption.breed = breed;
        if (age !== undefined) adoption.age = age;
        if (location !== undefined) adoption.location = location;
        if (imageUrl !== undefined) adoption.imageUrl = imageUrl;
        if (description !== undefined) adoption.description = description;
        if (status !== undefined) adoption.status = status;
        if (isAdopted !== undefined) adoption.isAdopted = isAdopted;

        await adoption.save();

        res.json(adoption);
    } catch (error) {
        res.status(500).json({ message: 'Error updating adoption listing', error: error.message });
    }
};

// Delete adoption listing
export const deleteAdoption = async (req, res) => {
    try {
        const adoption = await Adoption.findById(req.params.id);

        if (!adoption) {
            return res.status(404).json({ message: 'Adoption listing not found' });
        }

        // Authentication check removed - anyone can delete

        await Adoption.findByIdAndDelete(req.params.id);
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