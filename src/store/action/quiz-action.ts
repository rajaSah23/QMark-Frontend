import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../../utils/APIClient";

export const createQuiz = createAsyncThunk("createQuiz", async (payload: any, { rejectWithValue }) => {
    try {
        const response = await apiClient.POST("/quiz", payload);
        return response.data?.data;
    } catch (error: any) {
        console.error("createQuiz error:", error?.response?.data || error?.message || error);
        return rejectWithValue(error?.response?.data || { message: "Failed to create quiz" });
    }
});

export const getQuizzes = createAsyncThunk("getQuizzes", async (_, { rejectWithValue }) => {
    try {
        const response = await apiClient.GET("/quiz");
        return response.data?.data;
    } catch (error: any) {
        console.error("getQuizzes error:", error?.response?.data || error?.message || error);
        return rejectWithValue(error?.response?.data || { message: "Failed to get quizzes" });
    }
});

export const getQuizById = createAsyncThunk("getQuizById", async (quizId: string, { rejectWithValue }) => {
    try {
        const response = await apiClient.GET(`/quiz/${quizId}`);
        return response.data?.data;
    } catch (error: any) {
        console.error("getQuizById error:", error?.response?.data || error?.message || error);
        return rejectWithValue(error?.response?.data || { message: "Failed to get quiz" });
    }
});

export const updateQuiz = createAsyncThunk("updateQuiz", async ({ quizId, ...payload }: any, { rejectWithValue }) => {
    try {
        const response = await apiClient.PUT(`/quiz/${quizId}`, payload);
        return response.data?.data;
    } catch (error: any) {
        console.log(error);
        return rejectWithValue(error?.response?.data || "Failed to update quiz");
    }
});

export const deleteQuiz = createAsyncThunk("deleteQuiz", async (quizId: string, { rejectWithValue }) => {
    try {
        const response = await apiClient.DELETE(`/quiz/${quizId}`);
        return response.data?.data;
    } catch (error: any) {
        console.log(error);
        return rejectWithValue(error?.response?.data || "Failed to delete quiz");
    }
});

export const submitAttempt = createAsyncThunk("submitAttempt", async ({ quizId, payload }: any, { rejectWithValue }) => {
    try {
        const response = await apiClient.POST(`/quiz/${quizId}/attempt`, payload);
        return response.data?.data;
    } catch (error: any) {
        console.error("submitAttempt error:", error?.response?.data || error?.message || error);
        return rejectWithValue(error?.response?.data || { message: "Failed to submit attempt" });
    }
});

export const getAttempts = createAsyncThunk("getAttempts", async (quizId: string, { rejectWithValue }) => {
    try {
        const response = await apiClient.GET(`/quiz/${quizId}/attempts`);
        return response.data?.data;
    } catch (error: any) {
        console.error("getAttempts error:", error?.response?.data || error?.message || error);
        return rejectWithValue(error?.response?.data || { message: "Failed to get attempts" });
    }
});

export const getAttemptById = createAsyncThunk("getAttemptById", async ({ quizId, attemptId }: any, { rejectWithValue }) => {
    try {
        // Since backend route is just /quiz/:quizId/attempts/:attemptId
        const response = await apiClient.GET(`/quiz/${quizId}/attempts/${attemptId}`);
        return response.data?.data;
    } catch (error: any) {
        console.error("getAttemptById error:", error?.response?.data || error?.message || error);
        return rejectWithValue(error?.response?.data || { message: "Failed to get attempt details" });
    }
});

export default {
    createQuiz,
    getQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    submitAttempt,
    getAttempts,
    getAttemptById
};
