
import './App.css'
import '@mantine/core/styles.css';
import HomePage from './pages/home'
import { createTheme, MantineProvider } from '@mantine/core'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import AboutUs from './pages/aboutUs';
import Header from './components/header';
import FooterLinks from './pages/home/Footer';
import FindJobs from './pages/findJobs/index.tsx';
import JobDetail from './pages/findJobs/JobDetail.tsx';
import ApplyNowForm from './pages/findJobs/ApplyNow.tsx';
import ViewProfile from './pages/profile/index.tsx';
import { Provider } from 'react-redux';
import store from './store/index.ts';
import { Questions } from './pages/question/index.tsx';
import QuestionAnalyticsPage from './pages/question/QuestionAnalyticsPage.tsx';
import QuestionInsightDetailPage from './pages/question/QuestionInsightDetailPage.tsx';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/dates/styles.css';
import LoginPage from './pages/auth/LoginPage.tsx';
import RegisterPage from './pages/auth/RegisterPage.tsx';
import OtpVerifyPage from './pages/auth/OtpVerifyPage.tsx';
import ForgotPassword from './pages/auth/forgotPassword/ForgotPassword.tsx';
import ResetPassword from './pages/auth/forgotPassword/ResetPassword.tsx';
import QuizLayout from './pages/quiz';
import QuizList from './pages/quiz/QuizList';
import CreateQuiz from './pages/quiz/CreateQuiz';
import QuizDetail from './pages/quiz/QuizDetail';
import QuizInstructions from './pages/quiz/QuizInstructions';
import QuizAttempt from './pages/quiz/QuizAttempt';
import AttemptResult from './pages/quiz/AttemptResult';
import AttemptHistory from './pages/quiz/AttemptHistory';
import ActivityDashboard from './pages/profile/ActivityDashboard';
import QuizPerformanceDashboard from './pages/profile/QuizPerformanceDashboard';

// Routes where the footer should be hidden
const FOOTER_HIDDEN_PATHS = ['/quiz', '/questions', '/dashboard', '/profile'];

const FooterConditional = () => {
  const location = useLocation();
  const hide = FOOTER_HIDDEN_PATHS.some(p => location.pathname.startsWith(p));
  if (hide) return null;
  return <FooterLinks />;
};

const HeaderConditional = () => {
  const location = useLocation();
  const hide = location.pathname.includes('/attempt');
  if (hide) return null;
  return <Header />;
};

function App() {
  const theme = createTheme({
    colors: {
      'mine-shaft': ['#f6f6f6', '#e7e7e7', '#d1d1d1', '#b0b0b0', '#888888', '#6d6d6d', '#5d5d5d', '#4f4f4f', '#454545', '#3d3d3d', '#2d2d2d',],
      'bright-sun': ['#fffbeb', '#fff3c6', '#ffe588', '#ffd149', '#ffbd20', '#f99b07', '#dd7302', '#b75006', '#943c0c', '#7a330d', '#461902',],
    },
  })

  return (
    <>
      <Provider store={store}>
        <MantineProvider defaultColorScheme='dark' theme={theme}>
          <Notifications />
          <BrowserRouter>
            <HeaderConditional />
            <Routes>
              {/* ✅ Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<ViewProfile />} />
                <Route path="/dashboard" element={<Navigate to="/dashboard/activity" replace />} />
                <Route path="/dashboard/activity" element={<ActivityDashboard />} />
                <Route path="/dashboard/quiz-performance" element={<QuizPerformanceDashboard />} />
                <Route path="/questions" element={<Questions />} />
                <Route path="/questions/analytics" element={<QuestionAnalyticsPage />} />
                <Route path="/questions/:questionId" element={<QuestionInsightDetailPage />} />
                <Route path="/questions/bookmarks" element={<Questions />} />

                {/* Quiz Feature Routes */}
                <Route path="/quiz" element={<QuizLayout />}>
                  <Route index element={<QuizList />} />
                  <Route path="create" element={<CreateQuiz />} />
                  <Route path=":quizId" element={<QuizDetail />} />
                  <Route path=":quizId/instructions" element={<QuizInstructions />} />
                  <Route path=":quizId/attempt" element={<QuizAttempt />} />
                  <Route path=":quizId/result/:attemptId" element={<AttemptResult />} />
                  <Route path=":quizId/history" element={<AttemptHistory />} />
                </Route>
              </Route>

              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-otp" element={<OtpVerifyPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path='/find-jobs' element={<FindJobs />} />
              <Route path='/job-detail' element={<JobDetail />} />
              <Route path='/job-apply' element={<ApplyNowForm />} />
              <Route path='/about' element={<AboutUs />} />
              <Route path='*' element={<HomePage />} />
            </Routes>
            <FooterConditional />
          </BrowserRouter>
        </MantineProvider>
      </Provider>
    </>
  )
}

const ProtectedRoute = () => {
  const userData = localStorage.getItem("userData");
  if (!userData) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default App
