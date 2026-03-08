import { createSlice } from "@reduxjs/toolkit";
import {
    getDailyActivityStats,
    getStreakRecord,
    getQuizPerformanceStats,
    getSubjectWisePerformance,
    getDifficultyWisePerformance,
    getPerformanceSummary,
} from "../action/performance-action";
import { toast } from "../../../utils/APIClient";

export interface PerformanceState {
    dailyActivityStats: any[];
    streakRecord: any | null;
    quizPerformanceStats: any[];
    subjectWisePerformance: any[];
    difficultyWisePerformance: any[];
    performanceSummary: any | null;
    // Separate loading flags to avoid race conditions between parallel fetches
    loadingStats: boolean;   // daily, quiz, subject, difficulty
    loadingMeta: boolean;    // streak, summary
    error: any;
    selectedDateRange: {
        startDate: string;
        endDate: string;
    } | null;
}

const initialState: PerformanceState = {
    dailyActivityStats: [],
    streakRecord: null,
    quizPerformanceStats: [],
    subjectWisePerformance: [],
    difficultyWisePerformance: [],
    performanceSummary: null,
    loadingStats: false,
    loadingMeta: false,
    error: null,
    selectedDateRange: null,
};

export const PerformanceSlice = createSlice({
    name: "performance",
    initialState,
    reducers: {
        setDateRange: (state, action) => {
            state.selectedDateRange = action.payload;
        },
        clearPerformanceData: (state) => {
            state.dailyActivityStats = [];
            state.quizPerformanceStats = [];
            state.subjectWisePerformance = [];
            state.difficultyWisePerformance = [];
        },
    },
    extraReducers: (builder) => {
        // getDailyActivityStats
        builder
            .addCase(getDailyActivityStats.pending, (state) => {
                state.loadingStats = true;
            })
            .addCase(getDailyActivityStats.fulfilled, (state, action) => {
                state.dailyActivityStats = action.payload ?? [];
                state.loadingStats = false;
            })
            .addCase(getDailyActivityStats.rejected, (state, action: any) => {
                state.loadingStats = false;
                state.error = action.payload;
                const errorMsg =
                    action?.payload?.message || "Failed to fetch daily activity";
                toast.error(errorMsg);
            });

        // getStreakRecord
        builder
            .addCase(getStreakRecord.pending, (state) => {
                state.loadingMeta = true;
            })
            .addCase(getStreakRecord.fulfilled, (state, action) => {
                state.streakRecord = action.payload;
                state.loadingMeta = false;
            })
            .addCase(getStreakRecord.rejected, (state, action: any) => {
                state.loadingMeta = false;
                state.error = action.payload;
                const errorMsg =
                    action?.payload?.message || "Failed to fetch streak record";
                toast.error(errorMsg);
            });

        // getQuizPerformanceStats
        builder
            .addCase(getQuizPerformanceStats.pending, (state) => {
                state.loadingStats = true;
            })
            .addCase(getQuizPerformanceStats.fulfilled, (state, action) => {
                state.quizPerformanceStats = action.payload ?? [];
                state.loadingStats = false;
            })
            .addCase(getQuizPerformanceStats.rejected, (state, action: any) => {
                state.loadingStats = false;
                state.error = action.payload;
                const errorMsg =
                    action?.payload?.message ||
                    "Failed to fetch quiz performance stats";
                toast.error(errorMsg);
            });

        // getSubjectWisePerformance
        builder
            .addCase(getSubjectWisePerformance.pending, (state) => {
                state.loadingStats = true;
            })
            .addCase(getSubjectWisePerformance.fulfilled, (state, action) => {
                state.subjectWisePerformance = action.payload ?? [];
                state.loadingStats = false;
            })
            .addCase(
                getSubjectWisePerformance.rejected,
                (state, action: any) => {
                    state.loadingStats = false;
                    state.error = action.payload;
                    const errorMsg =
                        action?.payload?.message ||
                        "Failed to fetch subject-wise performance";
                    toast.error(errorMsg);
                }
            );

        // getDifficultyWisePerformance
        builder
            .addCase(getDifficultyWisePerformance.pending, (state) => {
                state.loadingStats = true;
            })
            .addCase(getDifficultyWisePerformance.fulfilled, (state, action) => {
                state.difficultyWisePerformance = action.payload ?? [];
                state.loadingStats = false;
            })
            .addCase(
                getDifficultyWisePerformance.rejected,
                (state, action: any) => {
                    state.loadingStats = false;
                    state.error = action.payload;
                    const errorMsg =
                        action?.payload?.message ||
                        "Failed to fetch difficulty-wise performance";
                    toast.error(errorMsg);
                }
            );

        // getPerformanceSummary
        builder
            .addCase(getPerformanceSummary.pending, (state) => {
                state.loadingMeta = true;
            })
            .addCase(getPerformanceSummary.fulfilled, (state, action) => {
                state.performanceSummary = action.payload;
                state.loadingMeta = false;
            })
            .addCase(getPerformanceSummary.rejected, (state, action: any) => {
                state.loadingMeta = false;
                state.error = action.payload;
                const errorMsg =
                    action?.payload?.message ||
                    "Failed to fetch performance summary";
                toast.error(errorMsg);
            });
    },
});

export const { setDateRange, clearPerformanceData } = PerformanceSlice.actions;

export default PerformanceSlice.reducer;
