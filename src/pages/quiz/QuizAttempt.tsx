import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getQuizById, submitAttempt } from '../../store/action/quiz-action';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge, Button, Card, Divider, Group, Loader, Modal, Progress, Radio, Text } from '@mantine/core';
import { toast } from '../../../utils/APIClient';

type PersistedQuestionStatus = 'not_answered' | 'answered' | 'marked_for_review';
type LiveQuestionStatus = 'not_visited' | 'not_answered' | 'answered' | 'review_pending' | 'review_answered';

type QuestionState = {
  draftAnswer: string | null;
  submittedAnswer: string | null;
  markedForReview: boolean;
  visited: boolean;
};

const defaultQuestionState: QuestionState = {
  draftAnswer: null,
  submittedAnswer: null,
  markedForReview: false,
  visited: false,
};

const createInitialQuestionStates = (questions: any[] = []) =>
  questions.reduce((acc: Record<string, QuestionState>, question: any) => {
    acc[question._id] = { ...defaultQuestionState };
    return acc;
  }, {});

const getLiveStatus = (state?: QuestionState): LiveQuestionStatus => {
  if (!state) return 'not_visited';
  if (state.markedForReview && state.submittedAnswer) return 'review_answered';
  if (state.markedForReview) return 'review_pending';
  if (state.submittedAnswer) return 'answered';
  if (state.visited) return 'not_answered';
  return 'not_visited';
};

const getPersistedStatus = (state?: QuestionState): PersistedQuestionStatus => {
  if (state?.markedForReview) return 'marked_for_review';
  if (state?.submittedAnswer) return 'answered';
  return 'not_answered';
};

const statusMeta: Record<LiveQuestionStatus, { label: string; className: string }> = {
  not_visited: {
    label: 'Not visited',
    className: 'border-mine-shaft-600 bg-mine-shaft-900 text-mine-shaft-300'
  },
  not_answered: {
    label: 'Not answered',
    className: 'border-orange-500/60 bg-orange-500/10 text-orange-200'
  },
  answered: {
    label: 'Answered',
    className: 'border-green-500/60 bg-green-500/10 text-green-200'
  },
  review_pending: {
    label: 'Marked for review',
    className: 'border-yellow-500/60 bg-yellow-500/10 text-yellow-100'
  },
  review_answered: {
    label: 'Review + answer saved',
    className: 'border-blue-500/60 bg-blue-500/10 text-blue-100'
  }
};

const QuizAttempt = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { currentQuiz, loading, loadingAction } = useSelector(
    (state: RootState) => state.quiz as any
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionStates, setQuestionStates] = useState<Record<string, QuestionState>>({});
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [fullscreenReady, setFullscreenReady] = useState(false);
  const [fullscreenRequestFailed, setFullscreenRequestFailed] = useState(false);
  const [endQuizModalOpen, setEndQuizModalOpen] = useState(false);

  const submittedRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const questionStatesRef = useRef<Record<string, QuestionState>>({});
  const currentQuestionIndexRef = useRef(0);
  const quizRef = useRef<any>(null);
  const sessionStartedRef = useRef(false);
  const ignoreFullscreenExitRef = useRef(false);

  useEffect(() => {
    questionStatesRef.current = questionStates;
  }, [questionStates]);

  useEffect(() => {
    currentQuestionIndexRef.current = currentQuestionIndex;
  }, [currentQuestionIndex]);

  useEffect(() => {
    quizRef.current = currentQuiz;
  }, [currentQuiz]);

  useEffect(() => {
    startTimeRef.current = startTime;
  }, [startTime]);

  useEffect(() => {
    sessionStartedRef.current = sessionStarted;
  }, [sessionStarted]);

  useEffect(() => {
    if (quizId) dispatch(getQuizById(quizId));
  }, [dispatch, quizId]);

  useEffect(() => {
    if (!currentQuiz?.questions?.length) return;

    const initialStates = createInitialQuestionStates(currentQuiz.questions);
    initialStates[currentQuiz.questions[0]._id] = {
      ...initialStates[currentQuiz.questions[0]._id],
      visited: true
    };

    setCurrentQuestionIndex(0);
    setQuestionStates(initialStates);
    questionStatesRef.current = initialStates;
    setSessionStarted(false);
    sessionStartedRef.current = false;
    setFullscreenReady(!!document.fullscreenElement);
    setFullscreenRequestFailed(false);
    setStartTime(null);
    startTimeRef.current = null;
    setTimeLeft(null);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuiz]);

  const startQuizSession = () => {
    if (!quizRef.current || sessionStartedRef.current) return;

    const now = Date.now();
    setStartTime(now);
    startTimeRef.current = now;
    setSessionStarted(true);
    sessionStartedRef.current = true;

    const limitMinutes = quizRef.current.settings?.timeLimit || 0;
    if (timerRef.current) clearInterval(timerRef.current);

    if (limitMinutes === 0) {
      setTimeLeft(null);
      return;
    }

    const totalSeconds = limitMinutes * 60;
    setTimeLeft(totalSeconds);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return prev;
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          window.setTimeout(() => {
            submitQuiz('dashboard');
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const requestBrowserFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
      setFullscreenReady(true);
      setFullscreenRequestFailed(false);
      startQuizSession();
    } catch (error) {
      setFullscreenReady(false);
      setFullscreenRequestFailed(true);
    }
  };

  useEffect(() => {
    if (!currentQuiz?.questions?.length || sessionStarted) return;

    requestBrowserFullscreen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuiz, sessionStarted]);

  useEffect(() => {
    const questions = quizRef.current?.questions || [];
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    setQuestionStates((prev) => ({
      ...prev,
      [currentQuestion._id]: {
        ...(prev[currentQuestion._id] || defaultQuestionState),
        visited: true,
      },
    }));
  }, [currentQuestionIndex]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!submittedRef.current) {
        e.preventDefault();
        e.returnValue = 'Leaving will submit your quiz.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      if (!submittedRef.current) {
        submitQuiz('detail');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement;
      setFullscreenReady(isFullscreen);

      if (!sessionStartedRef.current || submittedRef.current) {
        return;
      }

      if (!isFullscreen && !ignoreFullscreenExitRef.current) {
        window.alert('Fullscreen mode was exited. The quiz will be submitted now and cannot be resumed.');
        submitQuiz('detail');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const updateQuestionState = (questionId: string, updater: (current: QuestionState) => QuestionState) => {
    setQuestionStates((prev) => ({
      ...prev,
      [questionId]: updater(prev[questionId] || defaultQuestionState),
    }));
  };

  const handleOptionSelect = (questionId: string, option: string) => {
    updateQuestionState(questionId, (current) => ({
      ...current,
      draftAnswer: current.draftAnswer === option ? null : option,
      visited: true,
    }));
  };

  const navigateToQuestion = (index: number) => {
    const questions = quizRef.current?.questions || [];
    const currentQuestion = questions[currentQuestionIndexRef.current];

    if (currentQuestion) {
      updateQuestionState(currentQuestion._id, (current) => ({
        ...current,
        draftAnswer: current.submittedAnswer,
        visited: true,
      }));
    }

    setCurrentQuestionIndex(index);
  };

  const saveCurrentAnswer = () => {
    const questions = quizRef.current?.questions || [];
    const currentQuestion = questions[currentQuestionIndexRef.current];
    if (!currentQuestion) return;

    updateQuestionState(currentQuestion._id, (current) => ({
      ...current,
      submittedAnswer: current.draftAnswer,
      draftAnswer: current.draftAnswer,
      visited: true,
    }));
  };

  const toggleMarkForReview = () => {
    const questions = quizRef.current?.questions || [];
    const currentQuestion = questions[currentQuestionIndexRef.current];
    if (!currentQuestion) return;

    updateQuestionState(currentQuestion._id, (current) => ({
      ...current,
      markedForReview: !current.markedForReview,
      submittedAnswer: current.draftAnswer,
      draftAnswer: current.draftAnswer,
      visited: true,
    }));
  };

  const moveToNextQuestion = (saveAnswer: boolean) => {
    const questions = quizRef.current?.questions || [];
    if (currentQuestionIndexRef.current >= questions.length - 1) return;

    if (saveAnswer) {
      saveCurrentAnswer();
    }

    navigateToQuestion(currentQuestionIndexRef.current + 1);
  };

  const moveToPreviousQuestion = () => {
    if (currentQuestionIndexRef.current === 0) return;
    navigateToQuestion(currentQuestionIndexRef.current - 1);
  };

  const endQuizEarly = async () => {
    setEndQuizModalOpen(false);
    await submitQuiz('detail');
  };

  const buildSubmissionPayload = () => {
    const quiz = quizRef.current;
    const questions = quiz?.questions || [];
    const currentQuestion = questions[currentQuestionIndexRef.current];
    const latestStates = { ...questionStatesRef.current };

    if (currentQuestion) {
      const currentState = latestStates[currentQuestion._id] || defaultQuestionState;
      latestStates[currentQuestion._id] = {
        ...currentState,
        submittedAnswer: currentState.draftAnswer,
        visited: true,
      };
    }

    return questions.map((question: any) => {
      const state = latestStates[question._id] || defaultQuestionState;
      return {
        question: question._id,
        selectedAnswer: state.submittedAnswer,
        status: getPersistedStatus(state),
        markedForReview: state.markedForReview,
        visited: state.visited,
      };
    });
  };

  const submitQuiz = async (mode: 'result' | 'dashboard' | 'detail' = 'result') => {
    const quiz = quizRef.current;
    const startedAt = startTimeRef.current;

    if (!quizId || !quiz || !startedAt || submittedRef.current) return;

    submittedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    ignoreFullscreenExitRef.current = true;
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (_) {
      }
    }

    const payload = {
      answers: buildSubmissionPayload(),
      timeTaken: Math.max(0, Math.round((Date.now() - startedAt) / 1000)),
    };

    const response: any = await dispatch(submitAttempt({ quizId, payload }));
    if (response?.error) {
      submittedRef.current = false;
      return;
    }

    const attemptId = response?.payload?._id || response?.payload?.attemptId;
    if (mode === 'dashboard') {
      toast.success('Time is up. Quiz submitted automatically.');
      navigate('/dashboard', { replace: true });
      return;
    }

    if (mode === 'detail') {
      toast.error('Quiz submitted because fullscreen was exited.');
      navigate(`/quiz/${quizId}`, { replace: true });
      return;
    }

    if (attemptId) {
      navigate(`/quiz/${quizId}/result/${attemptId}`, { replace: true });
      return;
    }

    navigate('/quiz', { replace: true });
  };

  if (loading || !currentQuiz) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  const questions = currentQuiz.questions || [];
  const question = questions[currentQuestionIndex];
  if (!question) {
    return <div className="text-center mt-20">No questions found for this quiz.</div>;
  }

  const currentState = questionStates[question._id] || defaultQuestionState;
  const progressValue = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const unsavedChanges = currentState.draftAnswer !== currentState.submittedAnswer;
  const sidebarCounts = questions.reduce(
    (acc: any, item: any) => {
      const status = getLiveStatus(questionStates[item._id]);
      if (status === 'answered') acc.answered += 1;
      if (status === 'not_answered') acc.notAnswered += 1;
      if (status === 'review_answered' || status === 'review_pending') acc.review += 1;
      return acc;
    },
    { answered: 0, notAnswered: 0, review: 0 }
  );

  if (!sessionStarted) {
    return (
      <div className="max-w-3xl mx-auto pt-16">
        <Card className="bg-mine-shaft-900 border border-mine-shaft-700 shadow-xl p-8 text-center space-y-5">
          <Text size="xl" fw={700} className="text-bright-sun-400">
            Fullscreen Required
          </Text>
          <Text c="dimmed">
            This quiz must be taken in browser fullscreen mode. If fullscreen is exited using `Esc` or any other method, the quiz will be submitted immediately and cannot be resumed.
          </Text>
          {fullscreenRequestFailed && (
            <Text c="red" size="sm">
              Fullscreen was not enabled. Use the button below to enter fullscreen and start the quiz.
            </Text>
          )}
          <Group justify="center">
            <Button color="green" size="md" onClick={requestBrowserFullscreen}>
              Enter Full Screen and Start Quiz
            </Button>
            <Button variant="filled" color="red" onClick={() => navigate(`/quiz/${quizId}`)}>
              End Quiz
            </Button>
          </Group>
        </Card>
      </div>
    );
  }

  const answeredCount = questions.reduce((count: number, item: any) => {
    const state = questionStates[item._id];
    return state?.submittedAnswer ? count + 1 : count;
  }, 0);

  return (
    <div className="space-y-6 pt-2 pb-10 max-w-6xl mx-auto">
      <Modal
        opened={endQuizModalOpen}
        onClose={() => setEndQuizModalOpen(false)}
        title={<Text fw={700} className="text-bright-sun-400">End Quiz</Text>}
        centered
      >
        <Text c="dimmed">
          Ending the quiz will submit your current responses, exit fullscreen, and return you to the quiz detail page. You cannot resume this attempt.
        </Text>
        <Group justify="flex-end" mt="xl">
          <Button variant="subtle" color="gray" onClick={() => setEndQuizModalOpen(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={endQuizEarly}>
            Confirm End Quiz
          </Button>
        </Group>
      </Modal>

      <Card radius="md" className="bg-mine-shaft-900 border border-mine-shaft-700">
        <Group justify="space-between" align="center">
          <div className="text-2xl md:text-3xl font-bold text-bright-sun-400">
            Q<span className="text-white">Mark</span>
          </div>

          <Group gap="sm">
            <Badge color="green" size="lg">
              {answeredCount} answered
            </Badge>
            <Badge color="yellow" size="lg">
              {sidebarCounts.review} marked
            </Badge>
            <Badge color={timeLeft === null ? 'gray' : timeLeft <= 60 ? 'red' : 'blue'} size="lg">
              {timeLeft === null ? 'No time limit' : `${formatTime(timeLeft)} remaining`}
            </Badge>
          </Group>

          <Button
            variant="filled"
            color="red"
            onClick={() => setEndQuizModalOpen(true)}
          >
            End Quiz
          </Button>
        </Group>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-6">
        <div className="space-y-6">
          <Group justify="space-between">
            <div>
              <Text size="xl" fw={700} className="text-bright-sun-400">
                {currentQuiz.title}
              </Text>
              <Text c="dimmed" size="sm">
                Question {currentQuestionIndex + 1} of {questions.length}
              </Text>
            </div>
            <Badge color="blue" size="lg">
              Jump between questions
            </Badge>
          </Group>

          <Progress value={progressValue} color="green" size="xl" radius="xl" striped animated />

          <Card className="bg-mine-shaft-900 border border-mine-shaft-700 shadow-xl p-8 min-h-[420px] flex flex-col">
            <div className="flex flex-wrap gap-2 mb-4">
              {question?.subject?.subject && <Badge variant="light" color="blue">{question.subject.subject}</Badge>}
              {question?.topic?.topic && <Badge variant="light" color="grape">{question.topic.topic}</Badge>}
              <Badge
                variant="outline"
                color={question?.difficulty === 'hard' ? 'red' : question?.difficulty === 'medium' ? 'yellow' : 'green'}
              >
                {question?.difficulty || 'easy'}
              </Badge>
              <Badge
                variant="light"
                color={currentState.markedForReview ? 'yellow' : currentState.submittedAnswer ? 'green' : currentState.visited ? 'orange' : 'gray'}
              >
                {currentState.markedForReview ? 'Marked for review' : currentState.submittedAnswer ? 'Answered' : currentState.visited ? 'Not answered' : 'Not visited'}
              </Badge>
            </div>

            <Text className="text-xl font-medium mb-8">
              <div dangerouslySetInnerHTML={{ __html: question.question }} />
            </Text>

            {unsavedChanges && (
              <div className="mb-4 rounded-md border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100">
                You changed the answer. Click <span className="font-semibold">Submit & Next</span>, <span className="font-semibold">Mark for Review</span>, or <span className="font-semibold">Submit Quiz</span> to save it.
              </div>
            )}

            <div className="space-y-4 flex-1">
              {question.options?.map((option: string, i: number) => (
                <div
                  key={i}
                  onClick={() => handleOptionSelect(question._id, option)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors border ${
                    currentState.draftAnswer === option
                      ? 'bg-green-900/40 border-green-500'
                      : 'bg-mine-shaft-800 border-mine-shaft-600 hover:border-mine-shaft-400'
                  }`}
                >
                  <Group>
                    <Radio
                      checked={currentState.draftAnswer === option}
                      onChange={() => {}}
                      color="green"
                      size="md"
                    />
                    <Text size="lg">{option}</Text>
                  </Group>
                </div>
              ))}
            </div>

            <Divider my="lg" color="mine-shaft.7" />

            <div className="flex flex-wrap gap-3 justify-between items-center">
              <Group>
                <Button
                  variant="outline"
                  color="gray"
                  onClick={moveToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
                {!isLastQuestion && (
                  <Button variant="default" onClick={() => moveToNextQuestion(false)}>
                    Next
                  </Button>
                )}
              </Group>

              <Group>
                <Button
                  variant="light"
                  color={currentState.markedForReview ? 'yellow' : 'blue'}
                  onClick={toggleMarkForReview}
                >
                  {currentState.markedForReview ? 'Unmark Review' : 'Mark for Review'}
                </Button>

                {!isLastQuestion && (
                  <Button
                    color="green"
                    onClick={() => moveToNextQuestion(true)}
                    disabled={!currentState.draftAnswer && !currentState.submittedAnswer}
                  >
                    {currentState.submittedAnswer && currentState.draftAnswer !== currentState.submittedAnswer
                      ? 'Resubmit & Next'
                      : 'Submit & Next'}
                  </Button>
                )}

                <Button
                  color="green"
                  onClick={() => submitQuiz('result')}
                  loading={loadingAction}
                  disabled={submittedRef.current}
                >
                  Submit Quiz
                </Button>
              </Group>
            </div>
          </Card>
        </div>

        <Card className="bg-mine-shaft-900 border border-mine-shaft-700 xl:sticky xl:top-4 h-fit">
          <Text fw={700} className="text-bright-sun-400 mb-4">Question Navigator</Text>

          <div className="grid grid-cols-3 gap-2 mb-5">
            <div className="rounded-md border border-green-500/40 bg-green-500/10 p-3">
              <Text size="xs" c="dimmed">Answered</Text>
              <Text fw={700}>{sidebarCounts.answered}</Text>
            </div>
            <div className="rounded-md border border-orange-500/40 bg-orange-500/10 p-3">
              <Text size="xs" c="dimmed">Not Answered</Text>
              <Text fw={700}>{sidebarCounts.notAnswered}</Text>
            </div>
            <div className="rounded-md border border-yellow-500/40 bg-yellow-500/10 p-3">
              <Text size="xs" c="dimmed">Review</Text>
              <Text fw={700}>{sidebarCounts.review}</Text>
            </div>
          </div>

          <div className="space-y-2 mb-5">
            {Object.entries(statusMeta).map(([key, meta]) => (
              <div key={key} className="flex items-center gap-3 text-sm text-mine-shaft-200">
                <span className={`h-3 w-3 rounded-full border ${meta.className}`} />
                <span>{meta.label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-5 gap-2">
            {questions.map((item: any, index: number) => {
              const status = getLiveStatus(questionStates[item._id]);
              const isActive = index === currentQuestionIndex;

              return (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => navigateToQuestion(index)}
                  className={`rounded-lg border px-2 py-3 text-sm font-semibold transition ${
                    statusMeta[status].className
                  } ${isActive ? 'ring-2 ring-bright-sun-400' : ''}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuizAttempt;
