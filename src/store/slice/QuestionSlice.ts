import { addToBookmarks, deleteQuestion, getQuestion, postQuestion, updateQuestion } from "../action/question-action"
import { toast } from "../../../utils/APIClient"
import { createSlice } from "@reduxjs/toolkit"



export interface InitialState {
    data: any,
    page: any,
    totalPages: any,
    total: any,
    error: any,
    loading: boolean,
    loadingAction: boolean
}


const initialState: InitialState = {
    data: [],
    page: 1,
    totalPages: 0,
    total: 0,
    error: null,
    loading: false,
    loadingAction: false,
}
export const QuestionSlice = createSlice({
    name: "questions",
    initialState,
    reducers: {
        clearState: (state) => {
            state.data = [];
            state.page = 1;
            state.totalPages = 0;
            state.total = 0;
            state.error = null;
            state.loading = false;
            state.loadingAction = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getQuestion.pending, (state, action) => {
            state.loading = true;
            // state.data = null;
        }).addCase(getQuestion.fulfilled, (state, action) => {
            state.data = [...state.data, ...action.payload.results];
            state.page = action.payload.page;
            state.total = action.payload.total
            state.totalPages = action.payload.totalPages
            state.error = null;
            state.loading = false;
        }).addCase(getQuestion.rejected, (state, action) => {
            // state = initialState
            state.loading = false;

        })

        builder.addCase(postQuestion.pending, (state, action) => {
        }).addCase(postQuestion.fulfilled, (state, action) => {
            state.data?.unshift(action.payload);
            state.total = state.total + 1;
            state.totalPages = Math.ceil(state.total / 10); // Assuming 10 items per
        }).addCase(postQuestion.rejected, (state, action) => {
            // state = initialState
        })

        builder.addCase(updateQuestion.pending, (state, action) => {
            state.loadingAction = true;
        }).addCase(updateQuestion.fulfilled, (state, action) => {
            const updatedData = state.data?.map((mcq: any) => {
                if (mcq._id === action.payload?._id) {
                    // Keep the existing bookmark status if not returned in update
                    return { ...mcq, ...action.payload };
                }
                return mcq;
            })
            state.data = updatedData;
            state.loadingAction = false;
            toast.success("Question updated successfully");
        }).addCase(updateQuestion.rejected, (state, action: any) => {
            state.loadingAction = false;
            toast.error(action?.payload || "Failed to update question");
        })

        builder.addCase(addToBookmarks.pending, (state, action) => {
            state.loadingAction = true;

        }).addCase(addToBookmarks.fulfilled, (state, action) => {
            const updatedData = state.data?.map((mcq: any) => {
                if (mcq._id === action.payload?._id) {
                    return action.payload;
                }
                return mcq;
            })
            state.data = updatedData;
            state.loadingAction = false;
            toast.success(action.payload?.bookmark ? "Added to bookmarks" : "Removed from bookmarks")
        }).addCase(addToBookmarks.rejected, (state, action: any) => {
            state.loadingAction = false;
            if (action?.payload?.statusCode === 500) {
                toast.error("Failed to add to bookmarks");
                return;
            }
            toast.error(action.payload?.message)
        })


        builder.addCase(deleteQuestion.pending, (state, action) => {
        }).addCase(deleteQuestion.fulfilled, (state, action) => {
            const filteredData = state.data?.filter((mcq: any) => mcq._id !== action.payload?._id);
            state.data = filteredData;
        }).addCase(deleteQuestion.rejected, (state, action) => {
            // state = initialState
        })
    }

})
export const { clearState } = QuestionSlice.actions;

export default QuestionSlice.reducer;



