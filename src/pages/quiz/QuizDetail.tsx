import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getQuizById } from '../../store/action/quiz-action';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Text, Group, Badge, Loader, Divider } from '@mantine/core';
import { IconClock, IconListNumbers, IconPlayerPlay, IconArrowLeft } from '@tabler/icons-react';

const QuizDetail = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { currentQuiz, loading } = useSelector((state: RootState) => state.quiz as any);

    useEffect(() => {
        if (quizId) dispatch(getQuizById(quizId));
    }, [dispatch, quizId]);

    if (loading || !currentQuiz) return <div className="flex justify-center items-center h-64"><Loader /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Button variant="subtle" color="gray" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate('/quiz')}>
                Back to Quizzes
            </Button>

            <Card className="bg-mine-shaft-900 text-white shadow-xl p-6 border border-mine-shaft-700">
                <Group justify="space-between" mb="md">
                    <h1 className="text-3xl font-bold text-bright-sun-400 m-0">{currentQuiz.title}</h1>
                    <Badge size="lg" color={currentQuiz.active ? 'green' : 'red'}>
                        {currentQuiz.active ? 'Active' : 'Inactive'}
                    </Badge>
                </Group>

                <Text size="lg" c="dimmed" mb="xl">
                    {currentQuiz.description || "No description provided."}
                </Text>

                <Divider my="sm" color="mine-shaft.7" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    <Card className="bg-mine-shaft-800 border-none flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 text-blue-400 rounded-lg">
                            <IconListNumbers size={32} />
                        </div>
                        <div>
                            <Text size="sm" c="dimmed">Total Questions</Text>
                            <Text size="xl" fw={700}>{currentQuiz.questions?.length || 0}</Text>
                        </div>
                    </Card>

                    <Card className="bg-mine-shaft-800 border-none flex items-center gap-4">
                        <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-lg">
                            <IconClock size={32} />
                        </div>
                        <div>
                            <Text size="sm" c="dimmed">Time Limit</Text>
                            <Text size="xl" fw={700}>{currentQuiz.settings?.timeLimit ? `${currentQuiz.settings.timeLimit} minutes` : 'No Limit'}</Text>
                        </div>
                    </Card>
                </div>

                <div className="space-y-2 mb-8">
                    <h3 className="text-lg font-semibold text-mine-shaft-300">Settings:</h3>
                    <Group gap="sm">
                        <Badge variant="outline" color={currentQuiz.settings?.shuffleQuestions ? 'green' : 'gray'}>
                            Shuffle Questions: {currentQuiz.settings?.shuffleQuestions ? 'Yes' : 'No'}
                        </Badge>
                        <Badge variant="outline" color={currentQuiz.settings?.shuffleOptions ? 'green' : 'gray'}>
                            Shuffle Options: {currentQuiz.settings?.shuffleOptions ? 'Yes' : 'No'}
                        </Badge>
                    </Group>
                </div>

                <Button 
                    fullWidth 
                    size="xl" 
                    color="green" 
                    leftSection={<IconPlayerPlay size={24} />}
                    onClick={() => navigate(`/quiz/${currentQuiz._id}/attempt`)}
                    disabled={!currentQuiz.active}
                >
                    Start Quiz Now
                </Button>
            </Card>
        </div>
    );
};

export default QuizDetail;
