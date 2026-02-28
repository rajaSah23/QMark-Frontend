import { createSlice } from "@reduxjs/toolkit";
import {
    createQuiz, getQuizzes, getQuizById, updateQuiz, deleteQuiz,
    submitAttempt, getAttempts, getAttemptById
} from "../action/quiz-action";
import { toast } from "../../../utils/APIClient";

export interface QuizState {
    quizList: any[];
    currentQuiz: any | null;
    attempts: any[];
    currentAttempt: any | null;
    loading: boolean;
    loadingAction: boolean;
    error: any;
}

const initialState: QuizState = {
    quizList: [],
    currentQuiz: null,
    attempts: [],
    currentAttempt: null,
    loading: false,
    loadingAction: false,
    error: null,
};

export const QuizSlice = createSlice({
    name: "quiz",
    initialState,
    reducers: {
        clearCurrentQuiz: (state) => {
            state.currentQuiz = null;
        },
        clearCurrentAttempt: (state) => {
            state.currentAttempt = null;
        }
    },
    extraReducers: (builder) => {
        // getQuizzes
        builder.addCase(getQuizzes.pending, (state) => {
            state.loading = true;
        }).addCase(getQuizzes.fulfilled, (state, action) => {
            state.quizList = action.payload;
            state.loading = false;
        }).addCase(getQuizzes.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // getQuizById
        builder.addCase(getQuizById.pending, (state) => {
            state.loading = true;
        }).addCase(getQuizById.fulfilled, (state, action) => {
            state.currentQuiz = action.payload;
            state.loading = false;
        }).addCase(getQuizById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // createQuiz
        builder.addCase(createQuiz.pending, (state) => {
            state.loadingAction = true;
        }).addCase(createQuiz.fulfilled, (state, action) => {
            state.quizList.unshift(action.payload);
            state.loadingAction = false;
            toast.success("Quiz created successfully");
        }).addCase(createQuiz.rejected, (state, action: any) => {
            state.loadingAction = false;
            const errorMsg = action?.payload?.message || action?.payload?.error || "Failed to create quiz";
            toast.error(errorMsg);
        });

        // updateQuiz
        builder.addCase(updateQuiz.pending, (state) => {
            state.loadingAction = true;
        }).addCase(updateQuiz.fulfilled, (state, action) => {
            state.currentQuiz = action.payload;
            state.quizList = state.quizList.map(q => q._id === action.payload._id ? action.payload : q);
            state.loadingAction = false;
            toast.success("Quiz updated successfully");
        }).addCase(updateQuiz.rejected, (state, action: any) => {
            state.loadingAction = false;
            const errorMsg = action?.payload?.message || action?.payload?.error || "Failed to update quiz";
            toast.error(errorMsg);
        });

        // deleteQuiz
        builder.addCase(deleteQuiz.pending, (state) => {
            state.loadingAction = true;
        }).addCase(deleteQuiz.fulfilled, (state, action) => {
            state.quizList = state.quizList.filter(q => q._id !== action.meta.arg);
            state.loadingAction = false;
            toast.success("Quiz deleted successfully");
        }).addCase(deleteQuiz.rejected, (state, action: any) => {
            state.loadingAction = false;
            const errorMsg = action?.payload?.message || action?.payload?.error || "Failed to delete quiz";
            toast.error(errorMsg);
        });

        // submitAttempt
        builder.addCase(submitAttempt.pending, (state) => {
            state.loadingAction = true;
        }).addCase(submitAttempt.fulfilled, (state, action) => {
            state.currentAttempt = action.payload;
            state.loadingAction = false;
            toast.success("Quiz submitted successfully!");
        }).addCase(submitAttempt.rejected, (state, action: any) => {
            state.loadingAction = false;
            const errorMsg = action?.payload?.message || action?.payload?.error || "Failed to submit attempt";
            toast.error(errorMsg);
        });

        // getAttempts
        builder.addCase(getAttempts.pending, (state) => {
            state.loading = true;
        }).addCase(getAttempts.fulfilled, (state, action) => {
            state.attempts = action.payload;
            state.loading = false;
        }).addCase(getAttempts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // getAttemptById
        builder.addCase(getAttemptById.pending, (state) => {
            state.loading = true;
        }).addCase(getAttemptById.fulfilled, (state, action) => {
            state.currentAttempt = action.payload;
            state.loading = false;
        }).addCase(getAttemptById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
});

export const { clearCurrentQuiz, clearCurrentAttempt } = QuizSlice.actions;

export default QuizSlice.reducer;
