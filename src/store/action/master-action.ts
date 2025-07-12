import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../../utils/APIClient";


export const addSubject = createAsyncThunk("addSubject", async (payload: any, { rejectWithValue }) => {
    try {
        const response = await apiClient.POST("/master/subject-topics", payload);
        // console.log("response", response.data?.data);
        
        return response.data?.data;
    } catch (error:any) {
        console.log(error);
        throw rejectWithValue(error?.response?.data ||"Data not found");
    }
})

export const createTopic = createAsyncThunk("createTopic", async (payload: any, { rejectWithValue }) => {
    try {
        const response = await apiClient.POST("/master/topic", payload);        
        return response.data?.data;
    } catch (error:any) {
        console.log(error);
        throw rejectWithValue(error?.response?.data ||"Failed to create topic");
    }
})

export const getSubjectList = createAsyncThunk("getSubjectList", async (params, { rejectWithValue }) => {    
    try {
        const response = await apiClient.GET("/master/subjects");
        
        return response.data?.data;
    } catch (error:any) {
        console.log(error);
        throw rejectWithValue(error?.response?.data ||"Data not found");
    }
})
export const deleteSubject = createAsyncThunk("deleteSubject", async (subjectId:any, { rejectWithValue }) => {    
    try {
        const response = await apiClient.DELETE(`/master/subject/${subjectId}`);
        
        return response.data?.data;
    } catch (error:any) {
        console.log(error);
        throw rejectWithValue(error?.response?.data ||"Data not found");
    }
})

export const deleteTopic = createAsyncThunk("deleteTopic", async (topicId:any, { rejectWithValue }) => {    
    try {
        const response = await apiClient.DELETE(`/master/topic/${topicId}`);
        
        return response.data?.data;
    } catch (error:any) {
        console.log(error);
        throw rejectWithValue(error?.response?.data ||"Failed to delete topic");
    }
})

export const updateSubject = createAsyncThunk("updateSubject", async ({subjectId,subject}:any, { rejectWithValue }) => {    
    try {
        const response = await apiClient.PUT(`/master/subject/${subjectId}`,{subject});
        
        return {subjectId,subject};
    } catch (error:any) {
        console.log(error);
        throw rejectWithValue(error?.response?.data || "Failed to update subject");
    }
})

export const updateTopic = createAsyncThunk("updateTopic", async ({topicId,topic}:any, { rejectWithValue }) => {    
    try {
        const response = await apiClient.PUT(`/master/topic/${topicId}`,{topic});
        
        return {topicId,topic};
    } catch (error:any) {
        console.log(error);
        throw rejectWithValue(error?.response?.data ||"Failed to update topic");
    }
})



export const getTopicList = createAsyncThunk("getTopicList", async (subjectId:any, { rejectWithValue }) => {    
    try {
        const response = await apiClient.GET(`/master/topics/${subjectId}`);
        
        return response.data?.data;
    } catch (error:any) {
        console.log(error);
        throw rejectWithValue(error?.response?.data ||"Data not found");
    }
})

export default { addSubject, getSubjectList }



