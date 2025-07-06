import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../../utils/APIClient";


export const addSubject = createAsyncThunk("addSubject", async (payload: any, { rejectWithValue }) => {
    try {
        const response = await apiClient.POST("/master/subject-topics", payload);
        console.log("response", response.data?.data);
        
        return response.data?.data;
    } catch (error) {
        console.log(error);
        rejectWithValue("Data not found");
    }
})

export const getSubjectList = createAsyncThunk("getSubjectList", async (params, { rejectWithValue }) => {    
    try {
        const response = await apiClient.GET("/master/subjects");
        
        return response.data?.data;
    } catch (error) {
        console.log(error);
        rejectWithValue("Data not found");
    }
})
export const deleteSubject = createAsyncThunk("deleteSubject", async (subjectId:any, { rejectWithValue }) => {    
    try {
        const response = await apiClient.DELETE(`/master/subject/${subjectId}`);
        
        return response.data?.data;
    } catch (error) {
        console.log(error);
        rejectWithValue("Data not found");
    }
})

export const getTopicList = createAsyncThunk("getTopicList", async (subjectId:any, { rejectWithValue }) => {    
    try {
        const response = await apiClient.GET(`/master/topics/${subjectId}`);
        
        return response.data?.data;
    } catch (error) {
        console.log(error);
        rejectWithValue("Data not found");
    }
})

export default { addSubject, getSubjectList }



