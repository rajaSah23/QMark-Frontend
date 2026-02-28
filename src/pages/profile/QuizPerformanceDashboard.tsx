import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
    getQuizPerformanceStats,
    getSubjectWisePerformance,
    getDifficultyWisePerformance,
} from '../../store/action/performance-action';
import { setDateRange } from '../../store/slice/PerformanceSlice';
import {
    Card,
    Text,
    Group,
    Badge,
    Loader,
    Grid,
    Table,
    Tabs,
} from '@mantine/core';
import {
    IconCalendar,
    IconTarget,
    IconTrendingUp,
    IconBook,
} from '@tabler/icons-react';
import { DatePickerInput } from '@mantine/dates';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
} from 'recharts';

const QuizPerformanceDashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        quizPerformanceStats,
        subjectWisePerformance,
        difficultyWisePerformance,
        loading,
    } = useSelector((state: RootState) => state.performance as any);

    const [dateRange, setLocalDateRange] = useState<[Date | null, Date | null]>([
        new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        new Date(),
    ]);

    const [activeTab, setActiveTab] = useState<string | null>('overview');

    useEffect(() => {
        if (dateRange[0] && dateRange[1]) {
            const startDate = dateRange[0].toISOString().split('T')[0];
            const endDate = dateRange[1].toISOString().split('T')[0];
            dispatch(setDateRange({ startDate, endDate }));
            dispatch(getQuizPerformanceStats({ startDate, endDate }));
            dispatch(getSubjectWisePerformance({ startDate, endDate }));
            dispatch(getDifficultyWisePerformance({ startDate, endDate }));
        }
    }, [dispatch, dateRange]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader />
            </div>
        );
    }

    // Calculate metrics
    const totalQuizzes = quizPerformanceStats.length;
    const avgScore =
        totalQuizzes > 0
            ? Math.round(
                  quizPerformanceStats.reduce(
                      (sum: number, q: any) => sum + (q.percentage || 0),
                      0
                  ) / totalQuizzes
              )
            : 0;
    const maxScore = Math.max(
        ...(quizPerformanceStats.map((q: any) => q.percentage || 0) || [0])
    );
    const minScore = Math.min(
        ...(quizPerformanceStats.map((q: any) => q.percentage || 0) || [100])
    );
    const passedQuizzes = quizPerformanceStats.filter(
        (q: any) => q.percentage >= 60
    ).length;

    const COLORS = ['#ffbd20', '#40c057', '#748ffc', '#ff6b6b', '#4c6ef5'];

    return (
        <div className="max-w-7xl mx-auto space-y-6 pt-6 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-bright-sun-400 mb-2">
                    Quiz Performance Dashboard
                </h1>
                <p className="text-mine-shaft-400">
                    Analyze your quiz performance and track progress
                </p>
            </div>

            {/* Date Range Picker */}
            <Card className="bg-mine-shaft-900 border border-mine-shaft-700 shadow-lg p-4">
                <Group grow>
                    <DatePickerInput
                        type="range"
                        label="Select Date Range"
                        placeholder="Pick dates range"
                        value={dateRange}
                        onChange={(value) =>
                            setLocalDateRange(value as [Date | null, Date | null])
                        }
                        clearable
                    />
                </Group>
            </Card>

            {/* Key Metrics */}
            <Grid>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Card className="bg-mine-shaft-800 border border-mine-shaft-700 hover:border-bright-sun-400 transition-colors">
                        <Group justify="space-between" mb="md">
                            <div>
                                <Text size="sm" c="dimmed" className="uppercase font-bold">
                                    Total Quizzes
                                </Text>
                                <Text size="xl" fw={700} className="text-bright-sun-400">
                                    {totalQuizzes}
                                </Text>
                            </div>
                            <IconTarget size={32} className="text-bright-sun-400" />
                        </Group>
                    </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Card className="bg-mine-shaft-800 border border-mine-shaft-700 hover:border-green-400 transition-colors">
                        <Group justify="space-between" mb="md">
                            <div>
                                <Text size="sm" c="dimmed" className="uppercase font-bold">
                                    Average Score
                                </Text>
                                <Text size="xl" fw={700} className="text-green-400">
                                    {avgScore}%
                                </Text>
                            </div>
                            <IconTrendingUp size={32} className="text-green-400" />
                        </Group>
                    </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Card className="bg-mine-shaft-800 border border-mine-shaft-700 hover:border-blue-400 transition-colors">
                        <Group justify="space-between" mb="md">
                            <div>
                                <Text size="sm" c="dimmed" className="uppercase font-bold">
                                    Passed Quizzes
                                </Text>
                                <Text size="xl" fw={700} className="text-blue-400">
                                    {passedQuizzes}/{totalQuizzes}
                                </Text>
                            </div>
                            <Badge color="blue" variant="light">
                                {totalQuizzes > 0
                                    ? Math.round((passedQuizzes / totalQuizzes) * 100)
                                    : 0}
                                %
                            </Badge>
                        </Group>
                    </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Card className="bg-mine-shaft-800 border border-mine-shaft-700 hover:border-purple-400 transition-colors">
                        <Group justify="space-between" mb="md">
                            <div>
                                <Text size="sm" c="dimmed" className="uppercase font-bold">
                                    Score Range
                                </Text>
                                <Text size="sm" fw={700} className="text-purple-400">
                                    {minScore}% - {maxScore}%
                                </Text>
                            </div>
                            <IconBook size={32} className="text-purple-400" />
                        </Group>
                    </Card>
                </Grid.Col>
            </Grid>

            {/* Charts and Analysis */}
            <Tabs value={activeTab} onChange={setActiveTab} color="green">
                <Tabs.List>
                    <Tabs.Tab value="overview">Score Distribution</Tabs.Tab>
                    <Tabs.Tab value="subject">Subject-wise</Tabs.Tab>
                    <Tabs.Tab value="difficulty">Difficulty-wise</Tabs.Tab>
                    <Tabs.Tab value="details">Quiz Details</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="overview" pt="xl">
                    <Grid>
                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Card className="bg-mine-shaft-900 border border-mine-shaft-700 shadow-lg p-6">
                                <Text size="lg" fw={700} mb="md" className="text-bright-sun-400">
                                    Quiz Score Distribution
                                </Text>
                                {quizPerformanceStats.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={quizPerformanceStats.slice(0, 10)}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                            <XAxis
                                                dataKey="quizTitle"
                                                stroke="#999"
                                                angle={-45}
                                                textAnchor="end"
                                                height={80}
                                                interval={0}
                                                tick={{ fontSize: 10 }}
                                            />
                                            <YAxis stroke="#999" />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#2d2d2d',
                                                    border: '1px solid #555',
                                                }}
                                                labelStyle={{ color: '#fff' }}
                                            />
                                            <Bar dataKey="percentage" fill="#ffbd20" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Text c="dimmed" ta="center" py="xl">
                                        No quiz data available
                                    </Text>
                                )}
                            </Card>
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Card className="bg-mine-shaft-900 border border-mine-shaft-700 shadow-lg p-6">
                                <Text size="lg" fw={700} mb="md" className="text-bright-sun-400">
                                    Pass/Fail Ratio
                                </Text>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={[
                                                {
                                                    name: 'Passed',
                                                    value: passedQuizzes,
                                                    color: '#40c057',
                                                },
                                                {
                                                    name: 'Failed',
                                                    value: totalQuizzes - passedQuizzes,
                                                    color: '#ff6b6b',
                                                },
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }: any) =>
                                                `${name}: ${value}`
                                            }
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {[
                                                {
                                                    name: 'Passed',
                                                    value: passedQuizzes,
                                                    color: '#40c057',
                                                },
                                                {
                                                    name: 'Failed',
                                                    value: totalQuizzes - passedQuizzes,
                                                    color: '#ff6b6b',
                                                },
                                            ].map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#2d2d2d',
                                                border: '1px solid #555',
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </Grid.Col>
                    </Grid>
                </Tabs.Panel>

                <Tabs.Panel value="subject" pt="xl">
                    <Card className="bg-mine-shaft-900 border border-mine-shaft-700 shadow-lg p-6">
                        <Text size="lg" fw={700} mb="md" className="text-bright-sun-400">
                            Subject-Wise Performance
                        </Text>
                        {subjectWisePerformance.length > 0 ? (
                            <ResponsiveContainer width="100%" height={400}>
                                <RadarChart data={subjectWisePerformance}>
                                    <PolarGrid stroke="#444" />
                                    <PolarAngleAxis
                                        dataKey="subject"
                                        stroke="#999"
                                    />
                                    <PolarRadiusAxis stroke="#999" />
                                    <Radar
                                        name="Average Score"
                                        dataKey="averageScore"
                                        stroke="#ffbd20"
                                        fill="#ffbd20"
                                        fillOpacity={0.6}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#2d2d2d',
                                            border: '1px solid #555',
                                        }}
                                    />
                                    <Legend />
                                </RadarChart>
                            </ResponsiveContainer>
                        ) : (
                            <Text c="dimmed" ta="center" py="xl">
                                No subject data available
                            </Text>
                        )}

                        {subjectWisePerformance.length > 0 && (
                            <Table striped mt="lg">
                                <Table.Thead className="bg-mine-shaft-950">
                                    <Table.Tr>
                                        <Table.Th>Subject</Table.Th>
                                        <Table.Th>Quizzes Taken</Table.Th>
                                        <Table.Th>Average Score</Table.Th>
                                        <Table.Th>Best Score</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {subjectWisePerformance.map(
                                        (subject: any, idx: number) => (
                                            <Table.Tr
                                                key={idx}
                                                className="hover:bg-mine-shaft-800"
                                            >
                                                <Table.Td fw={500}>
                                                    {subject.subject}
                                                </Table.Td>
                                                <Table.Td>{subject.quizzesTaken}</Table.Td>
                                                <Table.Td>
                                                    <Badge
                                                        color={
                                                            subject.averageScore >= 70
                                                                ? 'green'
                                                                : subject.averageScore >=
                                                                      50
                                                                    ? 'yellow'
                                                                    : 'red'
                                                        }
                                                    >
                                                        {subject.averageScore}%
                                                    </Badge>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Text fw={600}>
                                                        {subject.bestScore}%
                                                    </Text>
                                                </Table.Td>
                                            </Table.Tr>
                                        )
                                    )}
                                </Table.Tbody>
                            </Table>
                        )}
                    </Card>
                </Tabs.Panel>

                <Tabs.Panel value="difficulty" pt="xl">
                    <Card className="bg-mine-shaft-900 border border-mine-shaft-700 shadow-lg p-6">
                        <Text size="lg" fw={700} mb="md" className="text-bright-sun-400">
                            Difficulty-Wise Performance
                        </Text>
                        {difficultyWisePerformance.length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={difficultyWisePerformance}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                        <XAxis dataKey="difficulty" stroke="#999" />
                                        <YAxis stroke="#999" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#2d2d2d',
                                                border: '1px solid #555',
                                            }}
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey="averageScore"
                                            fill="#40c057"
                                            name="Average Score"
                                        />
                                        <Bar
                                            dataKey="accuracy"
                                            fill="#748ffc"
                                            name="Accuracy"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>

                                <Table striped mt="lg">
                                    <Table.Thead className="bg-mine-shaft-950">
                                        <Table.Tr>
                                            <Table.Th>Difficulty</Table.Th>
                                            <Table.Th>Questions Solved</Table.Th>
                                            <Table.Th>Correct Answers</Table.Th>
                                            <Table.Th>Accuracy</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {difficultyWisePerformance.map(
                                            (difficulty: any, idx: number) => (
                                                <Table.Tr
                                                    key={idx}
                                                    className="hover:bg-mine-shaft-800"
                                                >
                                                    <Table.Td fw={500}>
                                                        <Badge
                                                            color={
                                                                difficulty.difficulty ===
                                                                'Easy'
                                                                    ? 'green'
                                                                    : difficulty.difficulty ===
                                                                          'Medium'
                                                                        ? 'yellow'
                                                                        : 'red'
                                                            }
                                                        >
                                                            {difficulty.difficulty}
                                                        </Badge>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        {difficulty.questionsSolved}
                                                    </Table.Td>
                                                    <Table.Td>
                                                        {difficulty.correctAnswers}
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Text fw={600}>
                                                            {difficulty.accuracy}%
                                                        </Text>
                                                    </Table.Td>
                                                </Table.Tr>
                                            )
                                        )}
                                    </Table.Tbody>
                                </Table>
                            </>
                        ) : (
                            <Text c="dimmed" ta="center" py="xl">
                                No difficulty data available
                            </Text>
                        )}
                    </Card>
                </Tabs.Panel>

                <Tabs.Panel value="details" pt="xl">
                    <Card className="bg-mine-shaft-900 border border-mine-shaft-700 shadow-lg overflow-hidden">
                        <Text size="lg" fw={700} mb="md" className="text-bright-sun-400 p-6">
                            Quiz Details
                        </Text>
                        {quizPerformanceStats.length > 0 ? (
                            <Table striped>
                                <Table.Thead className="bg-mine-shaft-950">
                                    <Table.Tr>
                                        <Table.Th>Quiz Title</Table.Th>
                                        <Table.Th>Score</Table.Th>
                                        <Table.Th>Percentage</Table.Th>
                                        <Table.Th>Time Taken</Table.Th>
                                        <Table.Th>Status</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {quizPerformanceStats.map(
                                        (quiz: any, idx: number) => (
                                            <Table.Tr
                                                key={idx}
                                                className="hover:bg-mine-shaft-800"
                                            >
                                                <Table.Td fw={500}>
                                                    {quiz.quizTitle}
                                                </Table.Td>
                                                <Table.Td>
                                                    {quiz.score}/{quiz.totalQuestions}
                                                </Table.Td>
                                                <Table.Td>
                                                    <Badge
                                                        color={
                                                            quiz.percentage >= 70
                                                                ? 'green'
                                                                : quiz.percentage >=
                                                                      50
                                                                    ? 'yellow'
                                                                    : 'red'
                                                        }
                                                    >
                                                        {quiz.percentage}%
                                                    </Badge>
                                                </Table.Td>
                                                <Table.Td>
                                                    {Math.round(
                                                        quiz.timeTaken / 60
                                                    )}m
                                                </Table.Td>
                                                <Table.Td>
                                                    <Badge
                                                        color={
                                                            quiz.percentage >= 60
                                                                ? 'green'
                                                                : 'red'
                                                        }
                                                    >
                                                        {quiz.percentage >= 60
                                                            ? 'Passed'
                                                            : 'Failed'}
                                                    </Badge>
                                                </Table.Td>
                                            </Table.Tr>
                                        )
                                    )}
                                </Table.Tbody>
                            </Table>
                        ) : (
                            <Text c="dimmed" ta="center" py="xl">
                                No quiz data available
                            </Text>
                        )}
                    </Card>
                </Tabs.Panel>
            </Tabs>
        </div>
    );
};

export default QuizPerformanceDashboard;
