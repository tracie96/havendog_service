import express from "express";
import { login, saveUsers, replaceUser, createPost, getPosts, likePost, createProfessional, publishPost, getAnimalById, updateAnimalById, deleteAnimalById, getProfessionals, getAnimalsByUserId, sendEmail, getProfessionalById, getProfessionalsByCategory, getSuggestions, updatePicturePaths, updateUserPicturePaths, updateAnimalPicturePaths, getAllPosts, getAllProfessionals, getAllUsers, getFilteredProfessionals, handleUser } from "../controllers/auth.js";
import { verifyToken } from '../middleware/auth.js';
import * as AuthController from '../controllers/auth.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import {
    register,
    updateBoardingAvailability,
    addPet,
    addService,
    getUserPets,
    getVetServices,
    getAvailableBoarders,
    getAllVets,
    getVetServicesById
} from '../controllers/auth.js';

const router = express.Router();

// Register a new user (pet owner or veterinarian)
router.post('/register', async (req, res) => {
    try {
        console.log('here');
        const {
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            userType,
            address,
            // Pet Owner specific fields
            preferredContactMethod,
            emergencyContact,
            veterinarian,
            // Veterinarian specific fields
            clinic,
            specialization,
            experience
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user object based on type
        const userData = {
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            userType,
            address
        };

        if (userType === 'petOwner') {
            userData.petOwnerInfo = {
                preferredContactMethod,
                emergencyContact,
                veterinarian
            };
        } else if (userType === 'veterinarian') {
            userData.veterinarianInfo = {
                clinic,
                specialization,
                experience
            };
        }

        const user = new User(userData);
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                userType: user.userType
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
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
                userType: user.userType
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// Pet routes
router.post('/pets', verifyToken, addPet);
router.get('/pets', verifyToken, getUserPets);
router.get('/pets/:id', verifyToken, getAnimalById);
router.put('/pets/:id', verifyToken, updateAnimalById);
router.delete('/pets/:id', verifyToken, deleteAnimalById);

// Update boarding/fostering preferences
router.put('/preferences', async (req, res) => {
    try {
        const { userId } = req.params;
        const { boardingPreferences, fosteringPreferences } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.userType !== 'petOwner') {
            return res.status(403).json({ message: 'Only pet owners can update these preferences' });
        }

        if (boardingPreferences) {
            user.petOwnerInfo.boardingPreferences = boardingPreferences;
        }

        if (fosteringPreferences) {
            user.petOwnerInfo.fosteringPreferences = fosteringPreferences;
        }

        await user.save();
        res.json({ message: 'Preferences updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating preferences', error: error.message });
    }
});

router.post('/authenticate', async (req, res) => {
    console.log('here');

    const { accessToken } = req.body;
    try {
        // Step 3: Validate Access Token with Google's API
        const userData = await AuthController.validateGoogleAccessToken(accessToken);

        // Step 4: Extract User Information
        const { sub, email, name } = userData;

        // Step 5: Check if the user exists in your database
        let user = await AuthController.findUserByEmail(email);

        // Step 6: Create/Register User if not exists
        if (!user) {
            user = await AuthController.createUser({ googleId: sub, email, name });
        }

        // Step 7: Generate Backend Session/Token
        const sessionToken = AuthController.generateSessionToken();

        // Step 8: Send Session Token back to Frontend
        res.json({ sessionToken });
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(401).json({ error: error.message });
    }
});

router.post('/professionals', createProfessional);

router.post("/replace", replaceUser);
router.post("/createPost", createPost);
router.post("/saveUsers", saveUsers);
router.post("/publishPost", verifyToken, publishPost);
router.post('/send-email', sendEmail);
// Make sure verifyToken middleware is applied before likePost
router.patch('/:id/likePost', verifyToken, likePost);

router.get('/animals/:userId', getAnimalsByUserId);
router.get('/pets/:id', getAnimalById);
router.get('/professionals', getAllProfessionals);
router.get('/posts', getAllPosts);
router.get('/users', getAllUsers);
router.get('/getPosts', getPosts);
router.get('/getProfessionals', getProfessionals);
router.get('/getProfessionalById/:id', getProfessionalById);
router.get('/getProfessionalsByCategory/:category', getProfessionalsByCategory);
router.get('/getSuggestions', getSuggestions); // New suggestion route
router.get('/getFilteredProfessionals', getFilteredProfessionals);

router.put('/animals/:id', updateAnimalById);
router.put('/professionals/updatePicturePaths/:professionalId', updatePicturePaths);
router.put('/users/updatePicturePaths/:userId', updateUserPicturePaths);
router.put('/pets/updatePicturePaths/:petId', updateAnimalPicturePaths);

router.delete('/animals/:id', deleteAnimalById);

// Protected routes
router.use(verifyToken);

// User profile and boarding
router.put('/boarding', updateBoardingAvailability);

// Pet owner routes
router.post('/pets', addPet);
router.get('/pets', getUserPets);

// Vet routes
router.post('/services', addService);
router.get('/services', getVetServices);

// Public information routes
router.get('/boarders', getAvailableBoarders);
router.get('/vets', getAllVets);
router.get('/vets/:vetId/services', getVetServicesById);

export default router;