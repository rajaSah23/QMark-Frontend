import { createSlice } from "@reduxjs/toolkit"
import { deleteQuestion, getQuestion, postQuestion } from "../action/question-action"



export interface InitialState {
    data: any,
    page:any,
    totalPages:any,
    total:any,
    error:any,
    loading:boolean
  }
 

const initialState:InitialState = {
    data:null,
    page:1,
    totalPages:0,
    total:0,
    error:null,
    loading:false
}
export const QuestionSlice = createSlice({
    name:"questions",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getQuestion.pending,(state,action)=>{
            state.loading=true;
            state.data = null;
        }).addCase(getQuestion.fulfilled,(state,action)=>{
            state.data = action.payload.results;
            state.page = action.payload.page;
            state.total = action.payload.total
            state.totalPages = action.payload.totalPages
            state.error = null;
            state.loading =false;
        }).addCase(getQuestion.rejected,(state,action)=>{
            state = initialState
        })

        builder.addCase(postQuestion.pending,(state,action)=>{
        }).addCase(postQuestion.fulfilled,(state,action)=>{
            state.data?.unshift(action.payload);
        }).addCase(postQuestion.rejected,(state,action)=>{
            // state = initialState
        })


        builder.addCase(deleteQuestion.pending,(state,action)=>{
        }).addCase(deleteQuestion.fulfilled,(state,action)=>{
            const filteredData = state.data?.filter((mcq:any)=> mcq._id!==action.payload?._id);
            state.data=filteredData;
        }).addCase(deleteQuestion.rejected,(state,action)=>{
            // state = initialState
        })
    }

})

export default QuestionSlice.reducer;



