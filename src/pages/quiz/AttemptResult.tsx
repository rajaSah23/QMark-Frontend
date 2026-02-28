import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getAttemptById } from '../../store/action/quiz-action';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Text, Group, Badge, Loader, RingProgress, Divider } from '@mantine/core';
import { IconCheck, IconX, IconArrowLeft, IconHistory } from '@tabler/icons-react';

const AttemptResult = () => {
    const { quizId, attemptId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    
    const { currentAttempt, loading } = useSelector((state: RootState) => state.quiz as any);

    useEffect(() => {
        if (quizId && attemptId) {
            dispatch(getAttemptById({ quizId, attemptId }));
        }
    }, [dispatch, quizId, attemptId]);

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader /></div>;
    
    if (!currentAttempt) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 pt-6 pb-12">
                <Button variant="subtle" color="gray" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate('/quiz')}>
                    Back to Quizzes
                </Button>
                <Card className="bg-mine-shaft-900 text-center py-12">
                    <Text size="lg" c="dimmed">Unable to load attempt results. Please try again.</Text>
                    <Button mt="md" onClick={() => navigate(`/quiz/${quizId}/history`)}>View Attempts</Button>
                </Card>
            </div>
        );
    }

    const { score = 0, totalQuestions = 0, percentage = 0, answers = [], quiz } = currentAttempt;
    const isPassing = percentage >= 60; // Just an arbitrary passing threshold

    return (
        <div className="max-w-4xl mx-auto space-y-8 pt-6 pb-12">
            <Group justify="space-between">
                <Button variant="subtle" color="gray" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate('/quiz')}>
                    Back to Quizzes
                </Button>
                <Button variant="outline" color="blue" leftSection={<IconHistory size={16} />} onClick={() => navigate(`/quiz/${quizId}/history`)}>
                    View All Attempts
                </Button>
            </Group>

            <Card className="bg-mine-shaft-900 border border-mine-shaft-700 shadow-xl p-8 text-center flex flex-col items-center">
                <Text size="xl" fw={700} className="text-bright-sun-400 mb-2">{quiz?.title || 'Quiz Results'}</Text>
                
                <RingProgress
                    size={200}
                    thickness={20}
                    roundCaps
                    sections={[{ value: percentage, color: isPassing ? 'green' : 'red' }]}
                    label={
                        <Text c={isPassing ? 'green' : 'red'} fw={700} ta="center" size="xl">
                            {percentage}%
                        </Text>
                    }
                />
                
                <Group mt="md" gap="xl">
                    <div>
                        <Text size="sm" c="dimmed">Score</Text>
                        <Text size="xl" fw={700}>{score} / {totalQuestions}</Text>
                    </div>
                </Group>
            </Card>

            <h2 className="text-2xl font-bold text-mine-shaft-300">Detailed Review</h2>
            
            <div className="space-y-6">
                {answers?.map((ans: any, idx: number) => {
                    // Extract data based on population state
                    const questionObj = ans.question || {};
                    const questionText = questionObj.question || 'Question text unavailable';
                    const correctAnswer = questionObj.correctAnswer;
                    const explanation = questionObj.explanation;
                    
                    return (
                        <Card 
                            key={idx} 
                            className={`bg-mine-shaft-800 border-l-4 shadow-md ${ans.isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}
                        >
                            <Group justify="space-between" align="flex-start" mb="md">
                                <Text fw={700} className="text-lg flex-1">
                                    {idx + 1}. <span dangerouslySetInnerHTML={{ __html: questionText }} />
                                </Text>
                                {ans.isCorrect ? (
                                    <Badge color="green" size="lg" leftSection={<IconCheck size={14} />}>Correct</Badge>
                                ) : (
                                    <Badge color="red" size="lg" leftSection={<IconX size={14} />}>Incorrect</Badge>
                                )}
                            </Group>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                                <div className={`p-3 rounded-md ${ans.isCorrect ? 'bg-green-900/40 text-green-100' : 'bg-red-900/40 text-red-100'}`}>
                                    <Text size="xs" c="dimmed" className="uppercase font-bold tracking-wider mb-1">Your Answer</Text>
                                    <Text fw={500}>{ans.selectedAnswer || <span className="italic">Skipped</span>}</Text>
                                </div>
                                
                                {!ans.isCorrect && (
                                    <div className="p-3 bg-green-900/40 text-green-100 rounded-md">
                                        <Text size="xs" color="green.2" className="uppercase font-bold tracking-wider mb-1">Correct Answer</Text>
                                        <Text fw={500}>{correctAnswer || 'Not available'}</Text>
                                    </div>
                                )}
                            </div>

                            {explanation && (
                                <>
                                    <Divider my="sm" color="mine-shaft.7" />
                                    <div className="bg-mine-shaft-900 p-4 rounded-md">
                                        <Text size="sm" fw={700} color="bright-sun.4" mb="xs">Explanation</Text>
                                        <Text size="sm"><div dangerouslySetInnerHTML={{ __html: explanation }} /></Text>
                                    </div>
                                </>
                            )}
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default AttemptResult;
