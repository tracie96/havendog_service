import User from '../models/User.js';
import Pet from '../models/Pet.js';
import Service from '../models/Service.js';
import jwt from 'jsonwebtoken';

// Register user
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, userType, phoneNumber, address } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = new User({
            firstName,
            lastName,
            email,
            password,
            userType,
            phoneNumber,
            address
        });

        await user.save();

        // Generate token
        const token = jwt.sign(
            { userId: user._id, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                userType: user.userType,
                phoneNumber: user.phoneNumber,
                address: user.address
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// Login controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                userType: user.userType,
                phoneNumber: user.phoneNumber,
                address: user.address,
                isBoardingAvailable: user.isBoardingAvailable,
                boardingFee: user.boardingFee
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

// Update boarding availability
export const updateBoardingAvailability = async (req, res) => {
    try {
        const { isBoardingAvailable, boardingFee } = req.body;
        const userId = req.user.userId;

        const user = await User.findByIdAndUpdate(
            userId,
            { isBoardingAvailable, boardingFee },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Boarding availability updated successfully',
            isBoardingAvailable: user.isBoardingAvailable,
            boardingFee: user.boardingFee
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating boarding availability', error: error.message });
    }
};

// Add pet (for pet owners)
export const addPet = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);

        if (!user || user.userType !== 'petOwner') {
            return res.status(403).json({ message: 'Only pet owners can add pets' });
        }

        const pet = new Pet({
            ...req.body,
            owner: userId
        });

        await pet.save();
        res.status(201).json(pet);
    } catch (error) {
        res.status(500).json({ message: 'Error adding pet', error: error.message });
    }
};

// Add service (for vets)
export const addService = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);

        if (!user || user.userType !== 'vet') {
            return res.status(403).json({ message: 'Only vets can add services' });
        }

        const service = new Service({
            ...req.body,
            vet: userId
        });

        await service.save();
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ message: 'Error adding service', error: error.message });
    }
};

// Get user's pets
export const getUserPets = async (req, res) => {
    try {
        const userId = req.user.userId;
        const pets = await Pet.find({ owner: userId });
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: 'Error getting pets', error: error.message });
    }
};

// Get vet's services
export const getVetServices = async (req, res) => {
    try {
        const userId = req.user.userId;
        const services = await Service.find({ vet: userId });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error getting services', error: error.message });
    }
};

// Get all available boarders
export const getAvailableBoarders = async (req, res) => {
    try {
        const boarders = await User.find({ isBoardingAvailable: true })
            .select('firstName lastName email phoneNumber address boardingFee');
        res.json(boarders);
    } catch (error) {
        res.status(500).json({ message: 'Error getting boarders', error: error.message });
    }
};

// Get all vets
export const getAllVets = async (req, res) => {
    try {
        const vets = await User.find({ userType: 'vet' })
            .select('firstName lastName email phoneNumber address');
        res.json(vets);
    } catch (error) {
        res.status(500).json({ message: 'Error getting vets', error: error.message });
    }
};

// Get vet's services by ID
export const getVetServicesById = async (req, res) => {
    try {
        const { vetId } = req.params;
        const services = await Service.find({ vet: vetId, isAvailable: true });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Error getting vet services', error: error.message });
    }
};

// Save users controller
export const saveUsers = async (req, res) => {
    try {
        const users = await User.insertMany(req.body);
        res.status(201).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error saving users', error: error.message });
    }
};

// Replace user controller
export const replaceUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndReplace(id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error replacing user', error: error.message });
    }
};

// Create post controller
export const createPost = async (req, res) => {
    try {
        // Implementation for creating a post
        res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error: error.message });
    }
};

// Get posts controller
export const getPosts = async (req, res) => {
    try {
        // Implementation for getting posts
        res.json({ message: 'Posts retrieved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error getting posts', error: error.message });
    }
};

// Like post controller
export const likePost = async (req, res) => {
    try {
        // Implementation for liking a post
        res.json({ message: 'Post liked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error liking post', error: error.message });
    }
};

// Create professional controller
export const createProfessional = async (req, res) => {
    try {
        // Implementation for creating a professional
        res.status(201).json({ message: 'Professional created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating professional', error: error.message });
    }
};

// Publish post controller
export const publishPost = async (req, res) => {
    try {
        // Implementation for publishing a post
        res.json({ message: 'Post published successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error publishing post', error: error.message });
    }
};

// Get animal by ID controller
export const getAnimalById = async (req, res) => {
    try {
        // Implementation for getting animal by ID
        res.json({ message: 'Animal retrieved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error getting animal', error: error.message });
    }
};

// Update animal by ID controller
export const updateAnimalById = async (req, res) => {
    try {
        // Implementation for updating animal
        res.json({ message: 'Animal updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating animal', error: error.message });
    }
};

// Delete animal by ID controller
export const deleteAnimalById = async (req, res) => {
    try {
        // Implementation for deleting animal
        res.json({ message: 'Animal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting animal', error: error.message });
    }
};

// Get professionals controller
export const getProfessionals = async (req, res) => {
    try {
        // Implementation for getting professionals
        res.json({ message: 'Professionals retrieved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error getting professionals', error: error.message });
    }
};

// Get animals by user ID controller
export const getAnimalsByUserId = async (req, res) => {
    try {
        // Implementation for getting animals by user ID
        res.json({ message: 'Animals retrieved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error getting animals', error: error.message });
    }
};

// Send email controller
export const sendEmail = async (req, res) => {
    try {
        // Implementation for sending email
        res.json({ message: 'Email sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending email', error: error.message });
    }
};

// Get professional by ID controller
export const getProfessionalById = async (req, res) => {
    try {
        // Implementation for getting professional by ID
        res.json({ message: 'Professional retrieved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error getting professional', error: error.message });
    }
};

// Get professionals by category controller
export const getProfessionalsByCategory = async (req, res) => {
    try {
        // Implementation for getting professionals by category
        res.json({ message: 'Professionals retrieved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error getting professionals', error: error.message });
    }
};

// Get suggestions controller
export const getSuggestions = async (req, res) => {
    try {
        // Implementation for getting suggestions
        res.json({ message: 'Suggestions retrieved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error getting suggestions', error: error.message });
    }
};

// Update picture paths controllers
export const updatePicturePaths = async (req, res) => {
    try {
        // Implementation for updating picture paths
        res.json({ message: 'Picture paths updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating picture paths', error: error.message });
    }
};

export const updateUserPicturePaths = async (req, res) => {
    try {
        // Implementation for updating user picture paths
        res.json({ message: 'User picture paths updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user picture paths', error: error.message });
    }
};

export const updateAnimalPicturePaths = async (req, res) => {
    try {
        // Implementation for updating animal picture paths
        res.json({ message: 'Animal picture paths updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating animal picture paths', error: error.message });
    }
};

// Get all posts controller
export const getAllPosts = async (req, res) => {
    try {
        // Implementation for getting all posts
        res.json({ message: 'All posts retrieved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error getting all posts', error: error.message });
    }
};

// Get all professionals controller
export const getAllProfessionals = async (req, res) => {
    try {
        // Implementation for getting all professionals
        res.json({ message: 'All professionals retrieved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error getting all professionals', error: error.message });
    }
};

// Get all users controller
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error getting all users', error: error.message });
    }
};

// Get filtered professionals controller
export const getFilteredProfessionals = async (req, res) => {
    try {
        // Implementation for getting filtered professionals
        res.json({ message: 'Filtered professionals retrieved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error getting filtered professionals', error: error.message });
    }
};

// Handle user controller
export const handleUser = async (req, res) => {
    try {
        // Implementation for handling user
        res.json({ message: 'User handled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error handling user', error: error.message });
    }
};

// Google authentication related functions
export const validateGoogleAccessToken = async (accessToken) => {
    // Implementation for validating Google access token
    return { sub: 'google-id', email: 'user@example.com', name: 'User Name' };
};

export const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

export const createUser = async (userData) => {
    const user = new User(userData);
    await user.save();
    return user;
};

export const generateSessionToken = () => {
    return jwt.sign({}, process.env.JWT_SECRET, { expiresIn: '24h' });
}; 