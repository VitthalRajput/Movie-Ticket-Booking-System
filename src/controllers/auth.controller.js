import bcrypt from "bcrypt";

import prisma from "../config/prisma.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../utils/token.js";


// REGISTER


const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // 1. Check whether user already exists
    const existingUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Create user
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    // 4. Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // 5. Remove password before sending response
    const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
    };

    // 6. Send response
    return res.status(201).json(
        new ApiResponse(
            201,
            {
                user: safeUser,
                accessToken,
                refreshToken,
            },
            "User registered successfully"
        )
    );
});


// LOGIN


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 1. Find user
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    // 2. Compare password
    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    // 3. Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // 4. Remove password from response
    const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
    };

    // 5. Send response
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                user: safeUser,
                accessToken,
                refreshToken,
            },
            "Login successful"
        )
    );
});


export {
    registerUser,
    loginUser,
};