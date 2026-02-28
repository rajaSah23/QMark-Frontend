import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../../utils/APIClient";



export const registerUser = createAsyncThunk(
    "registerUser",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await apiClient.POST("/user/register", payload);
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
            const response = await apiClient.POST("/user/resend-otp", payload);
            return response.data?.data;
        } catch (error: any) {
            const message = error.response?.data || { message: "Unknown error" };
            return rejectWithValue(message);
        }
    }
);

export const forgotPassword = createAsyncThunk(
    "forgotPassword",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await apiClient.POST("/user/forgot-password", payload);
            console.log(response.data?.data);

            return response.data;
        } catch (error: any) {
            const payload = error.response?.data || { message: "Unknown error" };
            return rejectWithValue(payload);
        }
    }
);

export const resetPassword = createAsyncThunk(
    "resetPassword",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await apiClient.POST("/user/reset-password", payload);
            return response.data;
        } catch (error: any) {
            const payload = error.response?.data || { message: "Unknown error" };
            return rejectWithValue(payload);
        }
    }
);

export const verifyOTP = createAsyncThunk(
    "verifyOTP",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response = await apiClient.POST("/user/verify-otp", payload);
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
            const response = await apiClient.POST("/user/login", payload);
            return response.data?.data;
        } catch (error: any) {
            const message = error.response?.data || { message: "Failed to login" };
            return rejectWithValue(message);
        }
    }
);


