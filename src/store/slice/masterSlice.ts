import { createSlice } from "@reduxjs/toolkit"
import { addSubject, deleteSubject, deleteTopic, getSubjectList, getTopicList, updateSubject, updateTopic } from "../action/master-action"
import { toast } from "../../../utils/APIClient"



export interface InitialState {
    subjectList: any[],
    loadingSubject:boolean,
    loadingSubjectAction:boolean,
    topicList:any[],
    loadingTopic:boolean,
    loadingTopicAction:boolean
  }
 

const initialState:InitialState = {
    subjectList:[],
    loadingSubject:false,
    loadingSubjectAction:false,
    topicList:[],
    loadingTopic:false,    
    loadingTopicAction:false
}
export const MasterSlice = createSlice({
    name:"master",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(addSubject.pending,(state,action)=>{
            state.loadingSubjectAction = true
        }).addCase(addSubject.fulfilled,(state,action)=>{
            const {subject, topics} = action.payload
            state.subjectList.push(subject);
            // state.topicList = [...state.topicList, ...topics]
            state.loadingSubjectAction = false;
            
        }).addCase(addSubject.rejected,(state,action)=>{
            // state = initialState
            state.loadingSubjectAction = false;
        })

        builder.addCase(getSubjectList.pending,(state,action)=>{
            state.loadingSubject = true;
        }).addCase(getSubjectList.fulfilled,(state,action)=>{
            state.subjectList = action.payload;
            state.loadingSubject = false;
        }).addCase(getSubjectList.rejected,(state,action)=>{
            state = initialState
            state.loadingSubject = false;
        })

        builder.addCase(deleteSubject.pending,(state,action)=>{
            state.loadingSubjectAction = true;
        }).addCase(deleteSubject.fulfilled,(state,action)=>{
            const filteredSubjects = state.subjectList.filter((subject:any)=> subject._id !== action.payload?._id);
            state.subjectList = filteredSubjects;
            state.loadingSubjectAction = false;
        }).addCase(deleteSubject.rejected,(state,action:any)=>{
            state = initialState
            state.loadingSubjectAction = false;
        })

        builder.addCase(deleteTopic.pending,(state,action)=>{
            state.loadingTopicAction = true;
        }).addCase(deleteTopic.fulfilled,(state,action)=>{
            const filteredTopics = state.topicList.filter((topic:any)=> topic._id !== action.payload?._id);
            state.topicList = filteredTopics;
            state.loadingTopicAction = false;
        }).addCase(deleteTopic.rejected,(state,action)=>{
            state = initialState
            state.loadingTopicAction = false;
        })
        
        builder.addCase(updateSubject.pending,(state,action)=>{
            state.loadingSubjectAction = true
        }).addCase(updateSubject.fulfilled,(state,action)=>{
            console.log("updateSubject.fulfilled");
            
            const {subjectId, subject}:any = action.payload;
            const updatedSubjects = state.subjectList.map((subj:any) => 
                subj._id === subjectId ? {...subj, subject} : subj
            );
            state.subjectList = updatedSubjects;
            state.loadingSubjectAction = false;
        }).addCase(updateSubject.rejected,(state,action:any)=>{
            console.log("updateSubject.rejected");
            state.loadingSubjectAction = false;
            if(action.payload?.statusCode === 500){
                toast.error("Failed to update subject");
                return;
            }
                
            toast.error(action?.payload?.message)

        })

        builder.addCase(updateTopic.pending,(state,action)=>{
            state.loadingTopicAction = true;
        }).addCase(updateTopic.fulfilled,(state,action)=>{
            const {topicId, topic}:any = action.payload;
            const updatedTopics = state.topicList.map((t:any) => 
                t._id === topicId ? {...t, topic} : t
            );
            state.topicList = updatedTopics;
            state.loadingTopicAction = false;
        }).addCase(updateTopic.rejected,(state,action)=>{
            state.loadingTopicAction = false;
        })

        builder.addCase(getTopicList.pending,(state,action)=>{
            state.loadingTopic = true;
        }).addCase(getTopicList.fulfilled,(state,action)=>{
            state.topicList = action.payload;
            state.loadingTopic = false;
        }).addCase(getTopicList.rejected,(state,action)=>{
            state = initialState
            state.loadingTopic = false;
        })

        
    }

})

export default MasterSlice.reducer;



