import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getQuizById, updateQuiz } from '../../store/action/quiz-action';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Text, Group, Badge, Loader, Divider, Switch } from '@mantine/core';
import {
    IconAdjustments,
    IconArrowLeft,
    IconClock,
    IconHistory,
    IconListNumbers,
    IconPlayerPlay,
} from '@tabler/icons-react';

const QuizDetail = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { currentQuiz, loading, loadingAction } = useSelector((state: RootState) => state.quiz as any);

    useEffect(() => {
        if (quizId) dispatch(getQuizById(quizId));
    }, [dispatch, quizId]);

    const handleToggleActive = (nextValue: boolean) => {
        if (!currentQuiz?._id) return;
        dispatch(updateQuiz({ quizId: currentQuiz._id, active: nextValue }));
    };

    if (loading || !currentQuiz) return <div className="flex justify-center items-center h-64"><Loader /></div>;

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <Button
                variant="subtle"
                color="gray"
                leftSection={<IconArrowLeft size={16} />}
                onClick={() => navigate('/quiz')}
            >
                Back to Quizzes
            </Button>

            <Card className="overflow-hidden border border-mine-shaft-700 bg-mine-shaft-900 p-0 text-white shadow-xl">
                <div className="bg-gradient-to-r from-mine-shaft-900 via-mine-shaft-900 to-mine-shaft-800/80 p-6 sm:p-8">
                    <Group justify="space-between" align="flex-start" gap="md">
                        <div className="max-w-3xl">
                            <Group gap="sm" mb="sm">
                                <Badge size="lg" color={currentQuiz.active ? 'green' : 'red'} variant="light">
                                    {currentQuiz.active ? 'Active' : 'Inactive'}
                                </Badge>
                                <Badge size="lg" variant="outline" color="gray">
                                    {currentQuiz.subject?.subject || 'No subject'}
                                </Badge>
                                <Badge size="lg" variant="outline" color="yellow">
                                    {currentQuiz.questions?.length || 0} Questions
                                </Badge>
                            </Group>
                            <h1 className="m-0 text-3xl font-bold text-bright-sun-400">{currentQuiz.title}</h1>
                            <Text size="lg" className="mt-3 text-mine-shaft-300">
                                {currentQuiz.description || "No description provided."}
                            </Text>
                        </div>
                        <div className="rounded-2xl border border-mine-shaft-700 bg-mine-shaft-800/70 px-4 py-3">
                            <Text size="xs" c="dimmed" className="uppercase tracking-[0.18em]">Quiz Status</Text>
                            <Group gap="sm" mt="sm">
                                <Switch
                                    size="md"
                                    color="green"
                                    checked={currentQuiz.active}
                                    onLabel="ON"
                                    offLabel="OFF"
                                    onChange={(event) => handleToggleActive(event.currentTarget.checked)}
                                    disabled={loadingAction}
                                />
                                <Text size="sm" c="dimmed">
                                    {currentQuiz.active ? 'Visible for attempts' : 'Attempts disabled'}
                                </Text>
                            </Group>
                        </div>
                    </Group>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <Button
                            size="md"
                            color="green"
                            leftSection={<IconPlayerPlay size={18} />}
                            onClick={() => navigate(`/quiz/${currentQuiz._id}/instructions`)}
                            disabled={!currentQuiz.active}
                        >
                            Start Quiz
                        </Button>
                        <Button
                            size="md"
                            variant="light"
                            color="yellow"
                            leftSection={<IconHistory size={18} />}
                            onClick={() => navigate(`/quiz/${currentQuiz._id}/history`)}
                        >
                            Attempt History
                        </Button>
                    </div>
                    {!currentQuiz.active && (
                        <Text size="sm" c="red.3" mt="md">
                            This quiz is inactive. You can review it, but new attempts are disabled until you switch it back on here.
                        </Text>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4 border-t border-mine-shaft-700 p-6 md:grid-cols-3">
                    <div className="rounded-2xl border border-mine-shaft-700 bg-mine-shaft-800/80 p-4">
                        <Group gap="sm">
                            <div className="rounded-xl bg-blue-500/15 p-3 text-blue-400">
                                <IconListNumbers size={22} />
                            </div>
                            <div>
                                <Text size="xs" c="dimmed">Total Questions</Text>
                                <Text fw={700} size="xl">{currentQuiz.questions?.length || 0}</Text>
                            </div>
                        </Group>
                    </div>

                    <div className="rounded-2xl border border-mine-shaft-700 bg-mine-shaft-800/80 p-4">
                        <Group gap="sm">
                            <div className="rounded-xl bg-cyan-500/15 p-3 text-cyan-400">
                                <IconClock size={22} />
                            </div>
                            <div>
                                <Text size="xs" c="dimmed">Time Limit</Text>
                                <Text fw={700} size="xl">
                                    {currentQuiz.settings?.timeLimit ? `${currentQuiz.settings.timeLimit} min` : 'No Limit'}
                                </Text>
                            </div>
                        </Group>
                    </div>

                    <div className="rounded-2xl border border-mine-shaft-700 bg-mine-shaft-800/80 p-4">
                        <Group gap="sm">
                            <div className="rounded-xl bg-yellow-500/15 p-3 text-yellow-400">
                                <IconAdjustments size={22} />
                            </div>
                            <div>
                                <Text size="xs" c="dimmed">Quiz Flow</Text>
                                <Text fw={700}>
                                    {currentQuiz.settings?.shuffleQuestions ? 'Questions shuffled' : 'Fixed question order'}
                                </Text>
                                <Text size="sm" c="dimmed">
                                    {currentQuiz.settings?.shuffleOptions ? 'Options shuffled' : 'Options fixed'}
                                </Text>
                            </div>
                        </Group>
                    </div>
                </div>
            </Card>

            <Card className="border border-mine-shaft-700 bg-mine-shaft-900 p-6 shadow-lg">
                <Group justify="space-between" mb="md">
                    <div>
                        <h2 className="m-0 text-xl font-bold text-bright-sun-400">Questions</h2>
                        <Text size="sm" c="dimmed" mt={4}>Preview the quiz content before starting.</Text>
                    </div>
                    <Badge variant="light" color="blue">
                        {currentQuiz.questions?.length || 0} listed
                    </Badge>
                </Group>

                <Divider my="sm" color="mine-shaft.7" />

                <div className="space-y-4">
                    {currentQuiz.questions?.map((q: any, idx: number) => (
                        <div
                            key={q._id}
                            className="rounded-2xl border border-mine-shaft-700 bg-mine-shaft-800/80 p-4 transition-colors hover:border-mine-shaft-600"
                        >
                            <div className="mb-3 inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-bright-sun-400 px-3 text-sm font-semibold text-mine-shaft-950">
                                {idx + 1}
                            </div>
                            <Text size="lg" fw={700}>
                                <div dangerouslySetInnerHTML={{ __html: q.question }} />
                            </Text>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default QuizDetail;
