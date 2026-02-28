import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../../utils/APIClient";

// Get daily activity stats (questions added, practice, revisions, streak)
export const getDailyActivityStats = createAsyncThunk(
    "getDailyActivityStats",
    async (
        { startDate, endDate }: { startDate: string; endDate: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiClient.GET("/performance/daily-activity", {
                startDate,
                endDate,
            });
            return response.data?.data;
        } catch (error: any) {
            console.error(
                "getDailyActivityStats error:",
                error?.response?.data || error?.message || error
            );
            return rejectWithValue(
                error?.response?.data || {
                    message: "Failed to fetch daily activity stats",
                }
            );
        }
    }
);

// Get streak record
export const getStreakRecord = createAsyncThunk(
    "getStreakRecord",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.GET("/performance/streak");
            return response.data?.data;
        } catch (error: any) {
            console.error(
                "getStreakRecord error:",
                error?.response?.data || error?.message || error
            );
            return rejectWithValue(
                error?.response?.data || { message: "Failed to fetch streak record" }
            );
        }
    }
);

// Get quiz performance stats
export const getQuizPerformanceStats = createAsyncThunk(
    "getQuizPerformanceStats",
    async (
        { startDate, endDate }: { startDate: string; endDate: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiClient.GET("/performance/quiz-stats", {
                startDate,
                endDate,
            });
            return response.data?.data;
        } catch (error: any) {
            console.error(
                "getQuizPerformanceStats error:",
                error?.response?.data || error?.message || error
            );
            return rejectWithValue(
                error?.response?.data || {
                    message: "Failed to fetch quiz performance stats",
                }
            );
        }
    }
);

// Get subject-wise performance
export const getSubjectWisePerformance = createAsyncThunk(
    "getSubjectWisePerformance",
    async (
        { startDate, endDate }: { startDate: string; endDate: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiClient.GET("/performance/subject-wise", {
                startDate,
                endDate,
            });
            return response.data?.data;
        } catch (error: any) {
            console.error(
                "getSubjectWisePerformance error:",
                error?.response?.data || error?.message || error
            );
            return rejectWithValue(
                error?.response?.data || {
                    message: "Failed to fetch subject-wise performance",
                }
            );
        }
    }
);

// Get difficulty-wise performance
export const getDifficultyWisePerformance = createAsyncThunk(
    "getDifficultyWisePerformance",
    async (
        { startDate, endDate }: { startDate: string; endDate: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await apiClient.GET("/performance/difficulty-wise", {
                startDate,
                endDate,
            });
            return response.data?.data;
        } catch (error: any) {
            console.error(
                "getDifficultyWisePerformance error:",
                error?.response?.data || error?.message || error
            );
            return rejectWithValue(
                error?.response?.data || {
                    message: "Failed to fetch difficulty-wise performance",
                }
            );
        }
    }
);

// Get overall performance summary
export const getPerformanceSummary = createAsyncThunk(
    "getPerformanceSummary",
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.GET("/performance/summary");
            return response.data?.data;
        } catch (error: any) {
            console.error(
                "getPerformanceSummary error:",
                error?.response?.data || error?.message || error
            );
            return rejectWithValue(
                error?.response?.data || {
                    message: "Failed to fetch performance summary",
                }
            );
        }
    }
);

export default {
    getDailyActivityStats,
    getStreakRecord,
    getQuizPerformanceStats,
    getSubjectWisePerformance,
    getDifficultyWisePerformance,
    getPerformanceSummary,
};
