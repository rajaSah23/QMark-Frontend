import { createSlice } from "@reduxjs/toolkit"
import { addToBookmarks, deleteQuestion, getQuestion, postQuestion } from "../action/question-action"
import { toast } from "../../../utils/APIClient"



export interface InitialState {
    data: any,
    page:any,
    totalPages:any,
    total:any,
    error:any,
    loading:boolean,
    loadingAction:boolean
  }
 

const initialState:InitialState = {
    data:null,
    page:1,
    totalPages:0,
    total:0,
    error:null,
    loading:false,
    loadingAction:false,
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
            state.total = state.total + 1;
            state.totalPages = Math.ceil(state.total / 10); // Assuming 10 items per
        }).addCase(postQuestion.rejected,(state,action)=>{
            // state = initialState
        })

        builder.addCase(addToBookmarks.pending,(state,action)=>{
            state.loadingAction = true;

        }).addCase(addToBookmarks.fulfilled,(state,action)=>{
            const updatedData = state.data?.map((mcq:any)=>{
                if(mcq._id === action.payload?._id){
                    return action.payload;
                }
                return mcq;
            })
            state.data = updatedData;
            state.loadingAction = false;
            toast.success(action.payload?.bookmark ? "Added to bookmarks":"Removed from bookmarks")
        }).addCase(addToBookmarks.rejected,(state,action:any)=>{
            state.loadingAction = false;
            if(action?.payload?.statusCode === 500){
                toast.error("Failed to add to bookmarks");
                return;
            }
            toast.error(action.payload?.message)
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



