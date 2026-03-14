import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserData } from "../../../utils/Utility";
import apiClient from "../../../utils/APIClient";

export const getQuestion = createAsyncThunk("getQuestion", async (query: any, { rejectWithValue }) => {
    try {
        const response = await apiClient.GET("mcq", query);
        console.log(response.data?.data);
        return response.data?.data;
    } catch (error) {
        console.log(error);
        return rejectWithValue("Data not found");

    }
})
export const postQuestion = createAsyncThunk("postQuestion", async (payload: any, { rejectWithValue }) => {
    try {
        const response = await apiClient.POST("mcq", payload);
        console.log("postQuestion", response.data?.data);
        return response.data?.data;
    } catch (error) {
        console.log(error);
        return rejectWithValue("Data not found");
    }
})

export const addToBookmarks = createAsyncThunk("addToBookmarks", async (payload: any, { rejectWithValue }) => {
    try {
        const response = await apiClient.PATCH("mcq", payload);
        console.log("addToBookmarks", response.data?.data);
        return response.data?.data;
    } catch (error: any) {
        console.log(error);
        return rejectWithValue(error?.response?.data || "Failed to add to bookmarks");
    }
})
export const deleteQuestion = createAsyncThunk("deleteQuestion", async (id: any, { rejectWithValue }) => {
    try {
        const response = await apiClient.DELETE(`mcq/${id}`);
        console.log("deleteQuestion", response.data?.data);
        return response.data?.data;
    } catch (error) {
        console.log(error);
        return rejectWithValue("Data not found");

    }
})

export const updateQuestion = createAsyncThunk("updateQuestion", async (payload: any, { rejectWithValue }) => {
    try {
        const response = await apiClient.PUT("mcq", payload);
        console.log("updateQuestion", response.data?.data);
        return response.data?.data;
    } catch (error: any) {
        console.log(error);
        return rejectWithValue(error?.response?.data || "Failed to update question");
    }
})

export const trackQuestionOptionClick = createAsyncThunk("trackQuestionOptionClick", async ({ questionId, selectedAnswer }: any, { rejectWithValue }) => {
    try {
        const response = await apiClient.POST(`/mcq/${questionId}/option-click`, { selectedAnswer });
        return response.data?.data;
    } catch (error: any) {
        console.log(error);
        return rejectWithValue(error?.response?.data || "Failed to track question interaction");
    }
})

export const getQuestionInteractionSummary = createAsyncThunk("getQuestionInteractionSummary", async (query: any, { rejectWithValue }) => {
    try {
        const response = await apiClient.GET("/mcq/analytics/summary", query);
        return response.data?.data;
    } catch (error: any) {
        console.log(error);
        return rejectWithValue(error?.response?.data || "Failed to fetch question interaction analytics");
    }
})

export default { getQuestion, postQuestion, updateQuestion }


