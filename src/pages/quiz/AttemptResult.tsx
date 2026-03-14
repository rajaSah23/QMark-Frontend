import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getAttemptById } from '../../store/action/quiz-action';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Text, Group, Badge, Loader, RingProgress, Divider } from '@mantine/core';
import {
    IconArrowLeft,
    IconCheck,
    IconClock,
    IconHistory,
    IconListCheck,
    IconTargetArrow,
    IconX,
} from '@tabler/icons-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    XAxis,
    YAxis,
} from 'recharts';

const statusBadgeMap: Record<string, { color: string; label: string }> = {
    answered: { color: 'green', label: 'Answered' },
    not_answered: { color: 'orange', label: 'Not Answered' },
    marked_for_review: { color: 'yellow', label: 'Marked for Review' }
};

const RESULT_COLORS = ['#40c057', '#fa5252', '#868e96'];
const STATUS_COLORS = ['#40c057', '#fcc419', '#868e96'];

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

    const analytics = useMemo(() => {
        if (!currentAttempt) return null;

        const answers = currentAttempt.answers || [];
        const answerSummary = currentAttempt.answerSummary || {
            answered: 0,
            markedForReview: 0,
            notAnswered: 0
        };

        const correctCount = answers.filter((answer: any) => !!answer.selectedAnswer && !!answer.isCorrect).length;
        const incorrectCount = answers.filter((answer: any) => !!answer.selectedAnswer && !answer.isCorrect).length;
        const notEvaluatedCount = answers.filter((answer: any) => !answer.selectedAnswer).length;

        const resultChart = [
            { name: 'Correct', value: correctCount, color: RESULT_COLORS[0] },
            { name: 'Incorrect', value: incorrectCount, color: RESULT_COLORS[1] },
            { name: 'Not Evaluated', value: notEvaluatedCount, color: RESULT_COLORS[2] },
        ].filter((item) => item.value > 0);

        const statusChart = [
            { name: 'Answered', value: answerSummary.answered || 0, color: STATUS_COLORS[0] },
            { name: 'Marked Review', value: answerSummary.markedForReview || 0, color: STATUS_COLORS[1] },
            { name: 'Not Answered', value: answerSummary.notAnswered || 0, color: STATUS_COLORS[2] },
        ].filter((item) => item.value > 0);

        const difficultyMap = answers.reduce((acc: Record<string, any>, answer: any) => {
            const key = answer.question?.difficulty || 'unspecified';
            if (!acc[key]) {
                acc[key] = {
                    difficulty: key.charAt(0).toUpperCase() + key.slice(1),
                    total: 0,
                    correct: 0,
                    incorrect: 0,
                    pending: 0,
                };
            }
            acc[key].total += 1;
            if (!answer.selectedAnswer) acc[key].pending += 1;
            else if (answer.isCorrect) acc[key].correct += 1;
            else acc[key].incorrect += 1;
            return acc;
        }, {});

        const difficultyChart = Object.values(difficultyMap);

        const subjectMap = answers.reduce((acc: Record<string, any>, answer: any) => {
            const key = answer.question?.subject?.subject || 'Unassigned';
            if (!acc[key]) {
                acc[key] = {
                    subject: key,
                    total: 0,
                    correct: 0,
                };
            }
            acc[key].total += 1;
            if (answer.isCorrect) acc[key].correct += 1;
            return acc;
        }, {});

        const subjectChart = Object.values(subjectMap)
            .map((item: any) => ({
                ...item,
                accuracy: item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0,
            }))
            .sort((a: any, b: any) => b.total - a.total)
            .slice(0, 6);

        return {
            correctCount,
            incorrectCount,
            notEvaluatedCount,
            resultChart,
            statusChart,
            difficultyChart,
            subjectChart,
        };
    }, [currentAttempt]);

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader /></div>;

    if (!currentAttempt || !analytics) {
        return (
            <div className="mx-auto max-w-5xl space-y-8 pb-12 pt-6">
                <Button variant="subtle" color="gray" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate('/quiz')}>
                    Back to Quizzes
                </Button>
                <Card className="bg-mine-shaft-900 py-12 text-center">
                    <Text size="lg" c="dimmed">Unable to load attempt results. Please try again.</Text>
                    <Button mt="md" onClick={() => navigate(`/quiz/${quizId}/history`)}>View Attempts</Button>
                </Card>
            </div>
        );
    }

    const { score = 0, totalQuestions = 0, percentage = 0, answers = [], quiz, answerSummary, timeTaken = 0 } = currentAttempt;
    const isPassing = percentage >= 60;

    return (
        <div className="mx-auto max-w-6xl space-y-8 pb-12 pt-6">
            <Group justify="space-between" align="center">
                <Button variant="subtle" color="gray" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate('/quiz')}>
                    Back to Quizzes
                </Button>
                <Button
                    variant="outline"
                    color="blue"
                    leftSection={<IconHistory size={16} />}
                    onClick={() => navigate(`/quiz/${quizId}/history`)}
                >
                    View All Attempts
                </Button>
            </Group>

            <Card className="overflow-hidden border border-mine-shaft-700 bg-mine-shaft-900 p-0 text-white shadow-xl">
                <div className="grid gap-6 bg-gradient-to-r from-mine-shaft-900 via-mine-shaft-900 to-mine-shaft-800/80 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
                    <div>
                        <Badge size="lg" color={isPassing ? 'green' : 'red'} variant="light">
                            {isPassing ? 'Strong attempt' : 'Needs review'}
                        </Badge>
                        <Text size="xl" fw={700} className="mt-3 text-bright-sun-400">
                            {quiz?.title || 'Quiz Results'}
                        </Text>
                        <Text className="mt-2 max-w-2xl text-mine-shaft-300">
                            Review your performance, answer states, and the question-level breakdown from this attempt.
                        </Text>

                        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <div className="rounded-2xl border border-mine-shaft-700 bg-mine-shaft-800/80 p-4">
                                <Text size="xs" c="dimmed">Score</Text>
                                <Text mt={4} fw={700} size="xl">{score} / {totalQuestions}</Text>
                            </div>
                            <div className="rounded-2xl border border-mine-shaft-700 bg-mine-shaft-800/80 p-4">
                                <Group gap={8}>
                                    <IconListCheck size={16} className="text-green-400" />
                                    <Text size="xs" c="dimmed">Answered</Text>
                                </Group>
                                <Text mt={4} fw={700} size="xl">{answerSummary?.answered || 0}</Text>
                            </div>
                            <div className="rounded-2xl border border-mine-shaft-700 bg-mine-shaft-800/80 p-4">
                                <Group gap={8}>
                                    <IconTargetArrow size={16} className="text-yellow-400" />
                                    <Text size="xs" c="dimmed">Marked Review</Text>
                                </Group>
                                <Text mt={4} fw={700} size="xl">{answerSummary?.markedForReview || 0}</Text>
                            </div>
                            <div className="rounded-2xl border border-mine-shaft-700 bg-mine-shaft-800/80 p-4">
                                <Group gap={8}>
                                    <IconClock size={16} className="text-cyan-400" />
                                    <Text size="xs" c="dimmed">Time Taken</Text>
                                </Group>
                                <Text mt={4} fw={700} size="xl">
                                    {Math.floor(timeTaken / 60)}m {timeTaken % 60}s
                                </Text>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center rounded-3xl border border-mine-shaft-700 bg-mine-shaft-800/50 p-6">
                        <RingProgress
                            size={220}
                            thickness={18}
                            roundCaps
                            sections={[
                                { value: percentage, color: isPassing ? 'green' : 'red' },
                                { value: Math.max(0, 100 - percentage), color: '#3d3d3d' }
                            ]}
                            label={
                                <div className="text-center">
                                    <Text c={isPassing ? 'green' : 'red'} fw={700} ta="center" size="34px">
                                        {percentage}%
                                    </Text>
                                    <Text size="sm" c="dimmed" ta="center">Accuracy</Text>
                                </div>
                            }
                        />
                    </div>
                </div>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border border-mine-shaft-700 bg-mine-shaft-900 p-5 shadow-lg">
                    <Group justify="space-between" mb="md">
                        <div>
                            <Text fw={700} className="text-bright-sun-400">Answer Status</Text>
                            <Text size="sm" c="dimmed">How the attempt was distributed.</Text>
                        </div>
                    </Group>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={analytics.statusChart} dataKey="value" nameKey="name" innerRadius={55} outerRadius={92} paddingAngle={4}>
                                    {analytics.statusChart.map((entry: any) => (
                                        <Cell key={entry.name} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #454545', borderRadius: '12px' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="border border-mine-shaft-700 bg-mine-shaft-900 p-5 shadow-lg">
                    <Group justify="space-between" mb="md">
                        <div>
                            <Text fw={700} className="text-bright-sun-400">Evaluated Result</Text>
                            <Text size="sm" c="dimmed">Correct vs incorrect vs skipped.</Text>
                        </div>
                    </Group>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={analytics.resultChart} dataKey="value" nameKey="name" innerRadius={55} outerRadius={92} paddingAngle={4}>
                                    {analytics.resultChart.map((entry: any) => (
                                        <Cell key={entry.name} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #454545', borderRadius: '12px' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border border-mine-shaft-700 bg-mine-shaft-900 p-5 shadow-lg">
                    <Group justify="space-between" mb="md">
                        <div>
                            <Text fw={700} className="text-bright-sun-400">Difficulty Breakdown</Text>
                            <Text size="sm" c="dimmed">See where accuracy changed by difficulty.</Text>
                        </div>
                    </Group>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.difficultyChart}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#3d3d3d" />
                                <XAxis dataKey="difficulty" stroke="#b5b5b5" />
                                <YAxis stroke="#b5b5b5" allowDecimals={false} />
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #454545', borderRadius: '12px' }}
                                />
                                <Legend />
                                <Bar dataKey="correct" stackId="a" fill="#40c057" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="incorrect" stackId="a" fill="#fa5252" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="pending" stackId="a" fill="#868e96" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="border border-mine-shaft-700 bg-mine-shaft-900 p-5 shadow-lg">
                    <Group justify="space-between" mb="md">
                        <div>
                            <Text fw={700} className="text-bright-sun-400">Subject Accuracy</Text>
                            <Text size="sm" c="dimmed">How the attempt performed across subjects.</Text>
                        </div>
                    </Group>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.subjectChart} layout="vertical" margin={{ left: 12, right: 12 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#3d3d3d" />
                                <XAxis type="number" stroke="#b5b5b5" domain={[0, 100]} />
                                <YAxis type="category" dataKey="subject" stroke="#b5b5b5" width={110} />
                                <RechartsTooltip
                                    formatter={(value: any) => [`${value}%`, 'Accuracy']}
                                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #454545', borderRadius: '12px' }}
                                />
                                <Bar dataKey="accuracy" fill="#ffbd20" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <div>
                <Group justify="space-between" mb="md">
                    <div>
                        <h2 className="m-0 text-2xl font-bold text-mine-shaft-300">Detailed Review</h2>
                        <Text size="sm" c="dimmed" mt={4}>Review each question with answer status and explanation.</Text>
                    </div>
                    <Badge variant="light" color="yellow">
                        {answers.length} questions reviewed
                    </Badge>
                </Group>

                <div className="space-y-6">
                    {answers?.map((ans: any, idx: number) => {
                        const questionObj = ans.question || {};
                        const questionText = questionObj.question || 'Question text unavailable';
                        const correctAnswer = questionObj.correctAnswer;
                        const explanation = questionObj.explanation;
                        const difficulty = questionObj.difficulty || 'unspecified';
                        const subject = questionObj.subject?.subject || 'Unassigned';

                        return (
                            <Card
                                key={idx}
                                className={`shadow-md border border-mine-shaft-700 bg-mine-shaft-900 ${
                                    !ans.selectedAnswer
                                        ? 'border-l-4 border-l-orange-500'
                                        : ans.isCorrect
                                            ? 'border-l-4 border-l-green-500'
                                            : 'border-l-4 border-l-red-500'
                                }`}
                            >
                                <Group justify="space-between" align="flex-start" mb="md">
                                    <div className="flex-1">
                                        <Group gap="xs" mb="sm">
                                            <Badge variant="light" color="blue">Q{idx + 1}</Badge>
                                            <Badge variant="outline" color="gray">{subject}</Badge>
                                            <Badge variant="outline" color="yellow">
                                                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                                            </Badge>
                                        </Group>
                                        <Text fw={700} className="text-lg">
                                            <div dangerouslySetInnerHTML={{ __html: questionText }} />
                                        </Text>
                                    </div>
                                    <Group gap="xs">
                                        <Badge color={statusBadgeMap[ans.status || 'not_answered']?.color || 'gray'} size="lg">
                                            {statusBadgeMap[ans.status || 'not_answered']?.label || 'Unknown'}
                                        </Badge>
                                        {ans.selectedAnswer ? (
                                            ans.isCorrect ? (
                                                <Badge color="green" size="lg" leftSection={<IconCheck size={14} />}>Correct</Badge>
                                            ) : (
                                                <Badge color="red" size="lg" leftSection={<IconX size={14} />}>Incorrect</Badge>
                                            )
                                        ) : (
                                            <Badge color="gray" size="lg">Not Evaluated</Badge>
                                        )}
                                    </Group>
                                </Group>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className={`rounded-xl p-4 ${ans.selectedAnswer ? (ans.isCorrect ? 'bg-green-900/30 text-green-100' : 'bg-red-900/30 text-red-100') : 'bg-mine-shaft-800 text-mine-shaft-200'}`}>
                                        <Text size="xs" c="dimmed" className="mb-1 uppercase font-bold tracking-wider">Your Answer</Text>
                                        <Text fw={500}>{ans.selectedAnswer || <span className="italic">Not answered</span>}</Text>
                                    </div>

                                    <div className="rounded-xl bg-green-900/30 p-4 text-green-100">
                                        <Text size="xs" c="green.2" className="mb-1 uppercase font-bold tracking-wider">Correct Answer</Text>
                                        <Text fw={500}>{correctAnswer || 'Not available'}</Text>
                                    </div>
                                </div>

                                {explanation && (
                                    <>
                                        <Divider my="md" color="mine-shaft.7" />
                                        <div className="rounded-xl bg-mine-shaft-800 p-4">
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
        </div>
    );
};

export default AttemptResult;
