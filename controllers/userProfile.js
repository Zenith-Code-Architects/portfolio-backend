import { UserProfileModel } from "../models/userProfile.js";
import { UserModel } from "../models/user.js";
import { userProfile_schema } from "../schema/userProfile_schema.js";

// create user profile
export const addUserProfile = async (req, res) => {
    try {
        const { error, value } = userProfile_schema.validate({
            ...req.body, 
            profilePicture: req.files.profilePicture[0].filename,
      resume: req.files.resume[0].filename,
    });
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const userSessionId = req.session?.user?.id || req?.user?.id;
        const user = await UserModel.findById(userSessionId);
        if (!user) {
            return res.status(404).json('User not found');
        }

        // Ensure req.file exists and is populated correctly
        if (!req.files) {
            return res.status(400).json('No file uploaded');
        }

        // Create user profile with the value and uploaded file
        const userProfile = await UserProfileModel.create({
            ...value,
            user: userSessionId,
            profilePicture: req.files.profilePicture[0].filename,
            resume: req.files.resume[0].filename 
        });

        // Update user's userProfile reference
        user.userProfile = userProfile.id;
        await user.save();

        // Return response
        res.status(201).json({ userProfile });
    } catch (error) {
        res.status(500).send(error);
    }
};


// GET user profile
export const getUserProfile = async (req, res, next) => {
    try {
        // Get user from session or request(token)
        const userId = req.session?.user?.id || req?.user?.id;
        const userProfile = await UserProfileModel.findById(userId);
        if (!userProfile) {
            return res.status(404).json('No profile added');
        }
        // Return response
        res.status(200).json(userProfile);
    } catch (error) {
        next(error);
    }
};

// UPDATE user profile
export const updateUserProfile = async (req, res, next) => {
    try {
        // validation
        const { error, value } = userProfile_schema.validate({
            ...req.body,
            profilePicture: req.files.profilePicture[0].filename,
            resume: req.files.resume[0].filename,
          });
        // Find user profile by ID and user session ID
        const userProfile = await UserProfileModel.findOne({
            _id: req.params.id,
            user: req.session.user.id
        });
        if (!userProfile) {
            return res.status(404).json('User profile not found');
        }

        // Update user profile with new data
        const updatedUserProfile = await UserProfileModel.findByIdAndUpdate(
            req.params.id,
            { 
                ...req.body, 
                profilePicture: req.files.profilePicture? req.files.profilePicture[0].filename : userProfile.profilePicture,
                resume: req.files.resume ? req.files.resume[0].filename : userProfile.resume },
            { new: true }
        );

        // Return response
        res.status(200).json({updatedUserProfile});
    } catch (error) {
        next(error);
    }
};

// DELETE user profile
// export const deleteUserProfile = async (req, res, next) => {
//     try {
//         // Delete user profile by ID and user session ID
//         await UserProfileModel.findOneAndDelete({
//             _id: req.params.id,
//             user: req.session.user.id
//         });

//         // Return response
//         res.status(200).json('User profile deleted');
//     } catch (error) {
//         next(error);
//     }
// };
