import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getQuizById, submitAttempt } from '../../store/action/quiz-action';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Text, Group, Radio, Loader, Progress, Badge } from '@mantine/core';

const QuizAttempt = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    
    const { currentQuiz, loading, loadingAction } = useSelector((state: RootState) => state.quiz as any);
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [startTime, setStartTime] = useState<number | null>(null);

    useEffect(() => {
        if (quizId) {
            setStartTime(Date.now());
            dispatch(getQuizById(quizId));
        }
    }, [dispatch, quizId]);

    const handleOptionSelect = (questionId: string, option: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: option
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < (currentQuiz?.questions?.length || 0) - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        if (!quizId || !startTime) return;
        
        // Format answers for backend
        const formattedAnswers = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
            question: questionId,
            selectedAnswer
        }));

        // Calculate actual time taken in seconds
        const timeTaken = Math.round((Date.now() - startTime) / 1000);
        
        const payload = {
            answers: formattedAnswers,
            timeTaken: timeTaken
        };

        dispatch(submitAttempt({ quizId, payload })).then((res: any) => {
            if (!res.error && res.payload?._id) {
                navigate(`/quiz/${quizId}/result/${res.payload._id}`);
            } else if (res.error) {
                console.error('Failed to submit attempt:', res.error);
            }
        }).catch(err => {
            console.error('Error submitting attempt:', err);
        });
    };

    if (loading || !currentQuiz) return <div className="flex justify-center items-center h-screen"><Loader /></div>;

    const questions = currentQuiz.questions || [];
    const question = questions[currentQuestionIndex];
    if (!question) return <div className="text-center mt-20">No questions found for this quiz.</div>;

    const progressValue = ((currentQuestionIndex + 1) / questions.length) * 100;
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const answeredCount = Object.keys(answers).length;

    return (
        <div className="max-w-3xl mx-auto space-y-6 pt-10">
            <Group justify="space-between">
                <Text size="xl" fw={700} className="text-bright-sun-400">{currentQuiz.title}</Text>
                <Badge color="blue" size="lg">Question {currentQuestionIndex + 1} of {questions.length}</Badge>
            </Group>
            
            <Progress value={progressValue} color="green" size="xl" radius="xl" striped animated />

            <Card className="bg-mine-shaft-900 border border-mine-shaft-700 shadow-xl p-8 min-h-[400px] flex flex-col">
                <Text className="text-xl font-medium mb-8">
                    <div dangerouslySetInnerHTML={{ __html: question.question }} />
                </Text>

                <div className="space-y-4 flex-1">
                    {question.options?.map((option: string, i: number) => (
                        <div 
                            key={i} 
                            onClick={() => handleOptionSelect(question._id, option)}
                            className={`p-4 rounded-lg cursor-pointer transition-colors border ${
                                answers[question._id] === option 
                                ? 'bg-green-900/40 border-green-500' 
                                : 'bg-mine-shaft-800 border-mine-shaft-600 hover:border-mine-shaft-400'
                            }`}
                        >
                            <Group>
                                <Radio 
                                    checked={answers[question._id] === option} 
                                    onChange={() => {}} // Handled by div click
                                    color="green"
                                    size="md"
                                />
                                <Text size="lg">{option}</Text>
                            </Group>
                        </div>
                    ))}
                </div>

                <Group justify="space-between" mt="xl" pt="md" className="border-t border-mine-shaft-700">
                    <Button 
                        variant="outline" 
                        color="gray" 
                        onClick={handlePrev} 
                        disabled={currentQuestionIndex === 0}
                    >
                        Previous
                    </Button>

                    <div className="text-sm text-mine-shaft-400">
                        {answeredCount} / {questions.length} Answered
                    </div>

                    {isLastQuestion ? (
                        <Button 
                            color="green" 
                            onClick={handleSubmit} 
                            loading={loadingAction}
                            disabled={answeredCount === 0}
                        >
                            Submit Quiz
                        </Button>
                    ) : (
                        <Button 
                            color="blue" 
                            onClick={handleNext}
                        >
                            Next Question
                        </Button>
                    )}
                </Group>
            </Card>
        </div>
    );
};

export default QuizAttempt;
