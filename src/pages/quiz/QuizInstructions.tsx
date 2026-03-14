import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getQuizById } from '../../store/action/quiz-action';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge, Button, Card, Group, Loader, List, Text } from '@mantine/core';

const QuizInstructions = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { currentQuiz, loading } = useSelector((state: RootState) => state.quiz as any);

    useEffect(() => {
        if (quizId) dispatch(getQuizById(quizId));
    }, [dispatch, quizId]);

    if (loading || !currentQuiz) {
        return <div className="flex justify-center items-center h-64"><Loader /></div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pt-6 pb-10">
            <div>
                <h1 className="text-3xl font-bold text-bright-sun-400">{currentQuiz.title}</h1>
                <p className="text-mine-shaft-400 text-sm">Read the instructions carefully before starting the quiz.</p>
            </div>

            <Card className="bg-mine-shaft-900 border border-mine-shaft-700 p-6">
                <Group gap="sm" mb="lg">
                    <Badge color="gray" variant="light">
                        {currentQuiz.subject?.subject || 'No subject'}
                    </Badge>
                    <Badge color="blue" variant="light">{currentQuiz.questions?.length || 0} Questions</Badge>
                    <Badge color="cyan" variant="light">
                        {currentQuiz.settings?.timeLimit ? `${currentQuiz.settings.timeLimit} minutes` : 'No time limit'}
                    </Badge>
                    <Badge color="green" variant="light">
                        Fullscreen Required
                    </Badge>
                </Group>

                <List spacing="md" size="sm" center>
                    <List.Item>The quiz starts only after browser fullscreen is enabled.</List.Item>
                    <List.Item>If fullscreen is exited at any point, the quiz is automatically submitted and cannot be resumed.</List.Item>
                    <List.Item>You can use the right-side question panel to jump between questions and monitor answered, not answered, and mark-for-review states.</List.Item>
                    <List.Item>Use the red <span className="font-semibold">End Quiz</span> button if you want to finish early.</List.Item>
                    <List.Item>Once the quiz is submitted, the attempt screen cannot be reopened using the browser back button.</List.Item>
                </List>

                <Text mt="xl" c="dimmed">
                    Click start only when you are ready to continue in fullscreen mode.
                </Text>
                {!currentQuiz.active && (
                    <Text mt="sm" c="red.3">
                        This quiz is currently inactive, so new attempts are disabled.
                    </Text>
                )}

                <Group justify="flex-end" mt="xl">
                    <Button variant="subtle" color="gray" onClick={() => navigate(`/quiz/${quizId}`)}>
                        Back to Quiz Detail
                    </Button>
                    <Button color="green" onClick={() => navigate(`/quiz/${quizId}/attempt`)} disabled={!currentQuiz.active}>
                        Start Quiz
                    </Button>
                </Group>
            </Card>
        </div>
    );
};

export default QuizInstructions;
