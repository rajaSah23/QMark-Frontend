import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserData } from "../../../utils/Utility";
import apiClient from "../../../utils/APIClient";

export const getQuestion = createAsyncThunk("getQuestion", async (query: any, { rejectWithValue }) => {
    // console.log(query);

    // const userData = getUserData();
    // const jwtToken = `Bearer ${userData?.token}`;


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
        rejectWithValue("Data not found");
    }
})

export const addToBookmarks = createAsyncThunk("addToBookmarks", async (payload:any, { rejectWithValue }) => {
    try {
        const response = await apiClient.PATCH("mcq", payload);
        console.log("addToBookmarks", response.data?.data);
        return response.data?.data;
    } catch (error:any) {
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

export default { getQuestion, postQuestion }



