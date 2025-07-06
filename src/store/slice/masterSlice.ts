import { createSlice } from "@reduxjs/toolkit"
import { addSubject, getSubjectList, getTopicList } from "../action/master-action"



export interface InitialState {
    subjectList: any[],
    topicList:any[]
  }
 

const initialState:InitialState = {
    subjectList:[],
    topicList:[]
}
export const MasterSlice = createSlice({
    name:"master",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(addSubject.pending,(state,action)=>{
        }).addCase(addSubject.fulfilled,(state,action)=>{
            const {subject, topics} = action.payload
            state.subjectList.push(subject);
            state.topicList = [...state.topicList, ...topics]
            
        }).addCase(addSubject.rejected,(state,action)=>{
            // state = initialState
        })

        builder.addCase(getSubjectList.pending,(state,action)=>{
        }).addCase(getSubjectList.fulfilled,(state,action)=>{
            state.subjectList = action.payload;
        }).addCase(getSubjectList.rejected,(state,action)=>{
            state = initialState
        })

        builder.addCase(getTopicList.pending,(state,action)=>{
        }).addCase(getTopicList.fulfilled,(state,action)=>{
            state.topicList = action.payload;
        }).addCase(getTopicList.rejected,(state,action)=>{
            state = initialState
        })

        
    }

})

export default MasterSlice.reducer;



