import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getQuizzes, deleteQuiz } from '../../store/action/quiz-action';
import { Button, Card, Text, Group, Badge, ActionIcon, Loader, Grid, Select } from '@mantine/core';
import {
    IconArrowRight,
    IconChartBar,
    IconClock,
    IconEye,
    IconHistory,
    IconPlayerPlay,
    IconTrash,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { getSubjectList } from '../../store/action/master-action';

const QuizList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { quizList, loading, loadingAction } = useSelector((state: RootState) => state.quiz as any);
    const { subjectList } = useSelector((state: RootState) => state.master as any);
    const [selectedSubject, setSelectedSubject] = React.useState<string>('all');

    useEffect(() => {
        dispatch(getQuizzes(selectedSubject === 'all' ? {} : { subject: selectedSubject }));
    }, [dispatch, selectedSubject]);

    useEffect(() => {
        if (!subjectList || subjectList.length === 0) {
            dispatch(getSubjectList(undefined as any));
        }
    }, [dispatch, subjectList]);

    const handleDelete = (quizId: string) => {
        if (window.confirm("Are you sure you want to delete this quiz?")) {
            dispatch(deleteQuiz(quizId)).then((res: any) => {
                if (!res.error) {
                    dispatch(getQuizzes(selectedSubject === 'all' ? {} : { subject: selectedSubject }));
                }
            });
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64"><Loader /></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-3xl border border-mine-shaft-700 bg-mine-shaft-900/70 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="m-0 text-2xl font-bold text-bright-sun-400">My Quizzes</h1>
                    <p className="mt-1 text-sm text-mine-shaft-300">Manage quizzes, start attempts, and review history.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Select
                        size="sm"
                        w={220}
                        value={selectedSubject}
                        onChange={(value) => setSelectedSubject(value || 'all')}
                        data={[
                            { label: 'All subject categories', value: 'all' },
                            { label: 'No subject category', value: 'unassigned' },
                            ...(subjectList?.map((subject: any) => ({
                                label: subject.subject,
                                value: subject._id
                            })) || [])
                        ]}
                    />
                    <Button
                        variant="light"
                        color="blue"
                        leftSection={<IconChartBar size={16} />}
                        onClick={() => navigate('/dashboard/quiz-performance')}
                    >
                        Quiz Performance
                    </Button>
                    <Button color="green" onClick={() => navigate('/quiz/create')}>
                        Create New Quiz
                    </Button>
                </div>
            </div>

            {quizList?.length === 0 && !loading && (
                <div className="rounded-3xl border border-dashed border-mine-shaft-700 py-16 text-center text-mine-shaft-400 text-lg">
                    No quizzes found. Create one to get started.
                </div>
            )}

            <Grid>
                {quizList?.map((quiz: any) => (
                    <Grid.Col span={{ base: 12, md: 6, lg: 4 }} key={quiz._id}>
                        <Card
                            className="group h-full cursor-pointer border border-mine-shaft-700 bg-mine-shaft-900 text-white shadow-lg transition-all hover:-translate-y-1 hover:border-bright-sun-400/60 hover:shadow-2xl"
                            onClick={() => navigate(`/quiz/${quiz._id}`)}
                        >
                            <div className="flex h-full flex-col gap-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <Text className="line-clamp-2 text-lg font-bold text-bright-sun-300" title={quiz.title}>
                                            {quiz.title}
                                        </Text>
                                        <Text size="sm" c="dimmed" mt={6} className="line-clamp-2 min-h-[40px]">
                                            {quiz.description || "No description provided."}
                                        </Text>
                                        <Group gap="xs" mt="sm">
                                            <Badge variant="outline" color="gray">
                                                {quiz.subject?.subject || 'No subject'}
                                            </Badge>
                                        </Group>
                                    </div>
                                    <Badge color={quiz.active ? 'green' : 'gray'} variant="light">
                                        {quiz.active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-2xl border border-mine-shaft-700 bg-mine-shaft-800/80 p-3">
                                        <Text size="xs" c="dimmed">Questions</Text>
                                        <Text fw={700} mt={4}>{quiz.questions?.length || 0}</Text>
                                    </div>
                                    <div className="rounded-2xl border border-mine-shaft-700 bg-mine-shaft-800/80 p-3">
                                        <Text size="xs" c="dimmed">Time Limit</Text>
                                        <Group gap={6} mt={4}>
                                            <IconClock size={14} className="text-cyan-400" />
                                            <Text fw={700}>{quiz.settings?.timeLimit ? `${quiz.settings.timeLimit} min` : 'No limit'}</Text>
                                        </Group>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between rounded-2xl border border-mine-shaft-700 bg-mine-shaft-800/60 px-3 py-2 text-sm text-mine-shaft-300">
                                    <span>Open details</span>
                                    <IconArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                </div>

                                <Group justify="space-between" mt="auto" className="border-t border-mine-shaft-700 pt-4">
                                    <Group gap="xs">
                                        <Button
                                            size="xs"
                                            color="green"
                                            leftSection={<IconPlayerPlay size={14} />}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                navigate(`/quiz/${quiz._id}/instructions`);
                                            }}
                                            disabled={!quiz.active}
                                        >
                                            Start
                                        </Button>
                                        <ActionIcon
                                            variant="light"
                                            color="blue"
                                            aria-label="View details"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                navigate(`/quiz/${quiz._id}`);
                                            }}
                                        >
                                            <IconEye size={16} />
                                        </ActionIcon>
                                        <ActionIcon
                                            variant="light"
                                            color="yellow"
                                            aria-label="Attempt history"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                navigate(`/quiz/${quiz._id}/history`);
                                            }}
                                        >
                                            <IconHistory size={16} />
                                        </ActionIcon>
                                    </Group>

                                    <ActionIcon
                                        color="red"
                                        variant="subtle"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleDelete(quiz._id);
                                        }}
                                        disabled={loadingAction}
                                        aria-label="Delete quiz"
                                    >
                                        <IconTrash size={18} />
                                    </ActionIcon>
                                </Group>
                            </div>
                        </Card>
                    </Grid.Col>
                ))}
            </Grid>
        </div>
    );
};

export default QuizList;
