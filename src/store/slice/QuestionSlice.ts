import { addToBookmarks, deleteQuestion, getQuestion, getQuestionInteractionSummary, postQuestion, trackQuestionOptionClick, updateQuestion } from "../action/question-action"
import { toast } from "../../../utils/APIClient"
import { createSlice } from "@reduxjs/toolkit"



export interface InitialState {
    data: any,
    page: any,
    totalPages: any,
    total: any,
    analyticsSummary: any,
    error: any,
    loading: boolean,
    loadingAction: boolean,
    loadingAnalytics: boolean
}


const initialState: InitialState = {
    data: [],
    page: 1,
    totalPages: 0,
    total: 0,
    analyticsSummary: {
        totalClicks: 0,
        uniqueQuestionsAttempted: 0,
        correctClicks: 0,
        incorrectClicks: 0,
        accuracy: 0,
        questionBreakdown: []
    },
    error: null,
    loading: false,
    loadingAction: false,
    loadingAnalytics: false
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
            state.analyticsSummary = {
                totalClicks: 0,
                uniqueQuestionsAttempted: 0,
                correctClicks: 0,
                incorrectClicks: 0,
                accuracy: 0,
                questionBreakdown: []
            };
            state.error = null;
            state.loading = false;
            state.loadingAction = false;
            state.loadingAnalytics = false;
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

        builder.addCase(getQuestionInteractionSummary.pending, (state) => {
            state.loadingAnalytics = true;
        }).addCase(getQuestionInteractionSummary.fulfilled, (state, action) => {
            state.analyticsSummary = action.payload || initialState.analyticsSummary;
            state.loadingAnalytics = false;
        }).addCase(getQuestionInteractionSummary.rejected, (state) => {
            state.loadingAnalytics = false;
        })

        builder.addCase(trackQuestionOptionClick.fulfilled, (state, action: any) => {
            const payload = action.payload;
            const currentQuestion = state.data?.find((mcq: any) => mcq._id === payload?.questionId);
            const previousStats = currentQuestion?.interactionStats || {
                totalClicks: 0,
                correctClicks: 0,
                incorrectClicks: 0,
                accuracy: 0,
                lastClickedAt: null
            };

            state.data = state.data?.map((mcq: any) => {
                if (mcq._id !== payload?.questionId) return mcq;
                return {
                    ...mcq,
                    interactionStats: payload?.stats || previousStats
                };
            });

            if (!payload?.stats) return;

            const totalClicksDelta = (payload.stats.totalClicks || 0) - (previousStats.totalClicks || 0);
            const correctClicksDelta = (payload.stats.correctClicks || 0) - (previousStats.correctClicks || 0);
            const incorrectClicksDelta = (payload.stats.incorrectClicks || 0) - (previousStats.incorrectClicks || 0);

            state.analyticsSummary.totalClicks += totalClicksDelta;
            state.analyticsSummary.correctClicks += correctClicksDelta;
            state.analyticsSummary.incorrectClicks += incorrectClicksDelta;
            state.analyticsSummary.accuracy = state.analyticsSummary.totalClicks > 0
                ? Math.round((state.analyticsSummary.correctClicks / state.analyticsSummary.totalClicks) * 100)
                : 0;

            if ((previousStats.totalClicks || 0) === 0 && (payload.stats.totalClicks || 0) > 0) {
                state.analyticsSummary.uniqueQuestionsAttempted += 1;
            }

            const breakdownIndex = state.analyticsSummary.questionBreakdown?.findIndex(
                (item: any) => item.questionId === payload.questionId
            );
            const breakdownItem = {
                questionId: payload.questionId,
                question: currentQuestion?.question || "Question unavailable",
                subject: currentQuestion?.subject?.subject || "Unassigned",
                totalClicks: payload.stats.totalClicks || 0,
                correctClicks: payload.stats.correctClicks || 0,
                incorrectClicks: payload.stats.incorrectClicks || 0,
                accuracy: payload.stats.accuracy || 0,
                lastClickedAt: payload.stats.lastClickedAt || null
            };

            if (breakdownIndex >= 0) {
                state.analyticsSummary.questionBreakdown[breakdownIndex] = breakdownItem;
            } else {
                state.analyticsSummary.questionBreakdown.unshift(breakdownItem);
            }
        })
    }

})
export const { clearState } = QuestionSlice.actions;

export default QuestionSlice.reducer;


