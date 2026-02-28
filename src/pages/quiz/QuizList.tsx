import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getQuizzes, deleteQuiz } from '../../store/action/quiz-action';
import { Button, Card, Text, Group, Badge, ActionIcon, Loader, Grid } from '@mantine/core';
import { IconTrash, IconPlayerPlay, IconHistory, IconEye } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const QuizList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { quizList, loading, loadingAction } = useSelector((state: RootState) => state.quiz as any);

    useEffect(() => {
        dispatch(getQuizzes());
    }, [dispatch]);

    const handleDelete = (quizId: string) => {
        if (window.confirm("Are you sure you want to delete this quiz?")) {
            dispatch(deleteQuiz(quizId)).then((res: any) => {
                if (!res.error) {
                    dispatch(getQuizzes());
                }
            });
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><Loader /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-bright-sun-400">My Quizzes</h1>
                <Button color="green" onClick={() => navigate('/quiz/create')}>Create New Quiz</Button>
            </div>

            {quizList?.length === 0 && !loading && (
                <div className="text-center py-10 text-mine-shaft-400 text-lg">
                    No quizzes found. Create one to get started!
                </div>
            )}

            <Grid>
                {quizList?.map((quiz: any) => (
                    <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={quiz._id}>
                        <Card className="bg-mine-shaft-800 text-white shadow-lg border border-mine-shaft-700 hover:border-bright-sun-400 transition-colors h-full flex flex-col justify-between">
                            <div>
                                <Group justify="space-between" mb="xs">
                                    <Text className="font-bold text-lg text-bright-sun-300 line-clamp-1 flex-1" title={quiz.title}>{quiz.title}</Text>
                                    <Badge color={quiz.active ? 'green' : 'gray'}>{quiz.active ? 'Active' : 'Inactive'}</Badge>
                                </Group>
                                
                                <Text size="sm" c="dimmed" mb="md" className="line-clamp-2 min-h-[40px]">
                                    {quiz.description || "No description provided."}
                                </Text>

                                <Group gap="xs" mb="lg">
                                    <Badge color="blue" variant="light">{quiz.questions?.length || 0} Questions</Badge>
                                    {quiz.settings?.timeLimit && (
                                        <Badge color="cyan" variant="light">{quiz.settings.timeLimit} minutes</Badge>
                                    )}
                                </Group>
                            </div>

                            <Group justify="space-between" mt="auto" className="border-t border-mine-shaft-600 pt-3">
                                <Group gap="xs">
                                    <Button 
                                        size="xs" 
                                        color="green" 
                                        leftSection={<IconPlayerPlay size={14} />}
                                        onClick={() => navigate(`/quiz/${quiz._id}/attempt`)}
                                    >
                                        Start
                                    </Button>
                                    <Button 
                                        size="xs" 
                                        variant="outline"
                                        color="blue"
                                        title="View Details"
                                        px="xs"
                                        onClick={() => navigate(`/quiz/${quiz._id}`)}
                                    >
                                        <IconEye size={16} />
                                    </Button>
                                    <Button 
                                        size="xs" 
                                        variant="outline"
                                        color="yellow"
                                        title="History"
                                        px="xs"
                                        onClick={() => navigate(`/quiz/${quiz._id}/history`)}
                                    >
                                        <IconHistory size={16} />
                                    </Button>
                                </Group>
                                
                                <ActionIcon 
                                    color="red" 
                                    variant="subtle" 
                                    onClick={() => handleDelete(quiz._id)}
                                    disabled={loadingAction}
                                >
                                    <IconTrash size={18} />
                                </ActionIcon>
                            </Group>
                        </Card>
                    </Grid.Col>
                ))}
            </Grid>
        </div>
    );
};

export default QuizList;
