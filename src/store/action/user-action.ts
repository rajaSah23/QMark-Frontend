import { createAsyncThunk } from "@reduxjs/toolkit";
import client from "../../../utils/APIClient";



export const registerUser = createAsyncThunk(
    "registerUser",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await client.post("/user/register", payload);
            return response.data?.data;
        } catch (error: any) {
            const message = error.response?.data || { message: "Unknown error" };
            return rejectWithValue(message);
        }
    }
);

export const resendOTP = createAsyncThunk(
    "resendOTP",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await client.post("/user/resend-otp", payload);
            return response.data?.data;
        } catch (error: any) {
            const message = error.response?.data || { message: "Unknown error" };
            return rejectWithValue(message);
        }
    }
);

export const verifyOTP = createAsyncThunk(
    "verifyOTP",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await client.post("/user/verify-otp", payload);
            return response.data?.data;
        } catch (error: any) {
            const message = error.response?.data || { message: "Unknown error" };
            return rejectWithValue(message);
        }
    }
);

export const loginUser = createAsyncThunk(
    "loginUser",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await client.post("/user/login", payload);
            return response.data?.data;
        } catch (error: any) {
            const message = error.response?.data || { message: "Failed to login" };
            return rejectWithValue(message);
        }
    }
);


