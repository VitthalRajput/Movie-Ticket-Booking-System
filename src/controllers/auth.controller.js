import bcrypt from "bcrypt";

import { prisma } from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    generateAccessToken,
    generateRefreshToken,
} from "../utils/token.js";

const cookieOptions = {
    httpOnly: true,
    secure: true,
};


// REGISTER


const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            passwordHash: hashedPassword,
        },
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Persist refresh token so logout has something to invalidate
    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });

    const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
    };

    return res
        .status(201)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                201,
                { user: safeUser, accessToken, refreshToken },
                "User registered successfully"
            )
        );
});


// LOGIN


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
    });

    const safeUser = {
        id: user.id,
        name: user.name,
        email: user.email,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { user: safeUser, accessToken, refreshToken },
                "Login successful"
            )
        );
});


// LOGOUT


const logoutUser = asyncHandler(async (req, res) => {
    // req.user is set by verifyJWT middleware — this route must be protected
    await prisma.user.update({
        where: { id: req.user.id },
        data: { refreshToken: null },
    });

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(
            200, 
            {}, 
            "Logged out successfully"
        ));
});


export {
    registerUser,
    loginUser,
    logoutUser,
};