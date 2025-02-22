import { createAsyncThunk } from "@reduxjs/toolkit";
import client from "../../../utils/APIClient";

export const getQuestion = createAsyncThunk("getQuestion", async (query:any, { rejectWithValue }) => {
    // console.log(query);
    
    try {
        const response =await client.get("mcq",{ params: query });
        console.log(response.data?.data);
        return response.data?.data;
    } catch (error) {
        console.log(error);
        rejectWithValue("Data not found");
        
    }
})
export const postQuestion = createAsyncThunk("postQuestion", async (payload:any, { rejectWithValue }) => {
    try {
        const response =await client.post("mcq",payload);
        console.log("postQuestion",response.data?.data);
        return response.data?.data;
    } catch (error) {
        console.log(error);
        rejectWithValue("Data not found");
    }
})
export const deleteQuestion = createAsyncThunk("deleteQuestion", async (id:any, { rejectWithValue }) => {
    try {
        const response =await client.delete(`mcq/${id}`);
        console.log("deleteQuestion",response.data?.data);
        return response.data?.data;
    } catch (error) {
        console.log(error);
        rejectWithValue("Data not found");
        
    }
})

export default {getQuestion ,postQuestion}



