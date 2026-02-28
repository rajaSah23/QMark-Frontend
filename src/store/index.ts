import { configureStore } from "@reduxjs/toolkit";
import questionReducer from "./slice/QuestionSlice";
import userSlice from "./slice/userSlice";
import masterSlice from "./slice/masterSlice";
import quizReducer from "./slice/QuizSlice";
import performanceReducer from "./slice/PerformanceSlice";

const store = configureStore({
    reducer: {
        questions: questionReducer,
        user: userSlice,
        master: masterSlice,
        quiz: quizReducer,
        performance: performanceReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
