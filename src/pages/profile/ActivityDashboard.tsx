import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
    getDailyActivityStats,
    getStreakRecord,
    getPerformanceSummary,
} from '../../store/action/performance-action';
import { setDateRange } from '../../store/slice/PerformanceSlice';
import {
    Card,
    Text,
    Group,
    Badge,
    Loader,
    Grid,
    Button,
    Tabs,
    Progress,
    RingProgress,
} from '@mantine/core';
import {
    IconCalendar,
    IconFlame,
    IconBookmark,
    IconRefresh,
    IconPencil,
    IconHistory,
    IconTrendingUp,
} from '@tabler/icons-react';
import { DatePickerInput } from '@mantine/dates';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const ActivityDashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { dailyActivityStats, streakRecord, performanceSummary, loading } =
        useSelector((state: RootState) => state.performance as any);

    const [dateRange, setLocalDateRange] = useState<[Date | null, Date | null]>([
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        new Date(),
    ]);

    useEffect(() => {
        if (dateRange[0] && dateRange[1]) {
            const startDate = dateRange[0].toISOString().split('T')[0];
            const endDate = dateRange[1].toISOString().split('T')[0];
            dispatch(setDateRange({ startDate, endDate }));
            dispatch(getDailyActivityStats({ startDate, endDate }));
        }
    }, [dispatch, dateRange]);

    useEffect(() => {
        dispatch(getStreakRecord());
        dispatch(getPerformanceSummary());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader />
            </div>
        );
    }

    // Calculate stats from daily activity data
    const totalQuestions = dailyActivityStats.reduce(
        (sum: number, day: any) => sum + (day.questionsAdded || 0),
        0
    );
    const totalPractice = dailyActivityStats.reduce(
        (sum: number, day: any) => sum + (day.practiceSessions || 0),
        0
    );
    const totalRevisions = dailyActivityStats.reduce(
        (sum: number, day: any) => sum + (day.revisionsSessions || 0),
        0
    );

    const currentStreak = streakRecord?.currentStreak || 0;
    const longestStreak = streakRecord?.longestStreak || 0;

    return (
        <div className="max-w-7xl mx-auto space-y-6 pt-6 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-bright-sun-400 mb-2">
                    Daily Activity Dashboard
                </h1>
                <p className="text-mine-shaft-400">
                    Track your learning journey and activity metrics
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
                        onChange={(value) => setLocalDateRange(value as [Date | null, Date | null])}
                        clearable
                    />
                </Group>
            </Card>

            {/* Streak Cards */}
            <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card className="bg-gradient-to-r from-orange-900 to-orange-700 border border-orange-600 shadow-xl">
                        <Group justify="space-between" mb="md">
                            <div>
                                <Text size="sm" c="dimmed" className="uppercase font-bold">
                                    Current Streak
                                </Text>
                                <Text size="xl" fw={700} className="text-white">
                                    {currentStreak} days
                                </Text>
                            </div>
                            <IconFlame size={40} className="text-orange-300" />
                        </Group>
                        <Progress value={(currentStreak % 30) * 3.33} color="orange" />
                        <Text size="xs" c="dimmed" mt="xs">
                            Keep it up! Your longest streak is {longestStreak} days
                        </Text>
                    </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                    <Card className="bg-gradient-to-r from-blue-900 to-cyan-700 border border-cyan-600 shadow-xl">
                        <Group justify="space-between" mb="md">
                            <div>
                                <Text size="sm" c="dimmed" className="uppercase font-bold">
                                    Total Active Days
                                </Text>
                                <Text size="xl" fw={700} className="text-white">
                                    {dailyActivityStats.filter((d: any) => d.totalActivity > 0).length}
                                </Text>
                            </div>
                            <IconTrendingUp size={40} className="text-cyan-300" />
                        </Group>
                        <Text size="xs" c="dimmed" mt="xs">
                            Days with recorded activity
                        </Text>
                    </Card>
                </Grid.Col>
            </Grid>

            {/* Activity Metrics */}
            <Grid>
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <Card className="bg-mine-shaft-800 border border-mine-shaft-700 hover:border-bright-sun-400 transition-colors h-full">
                        <Group justify="space-between" mb="md">
                            <div>
                                <Text size="sm" c="dimmed" className="uppercase font-bold">
                                    Questions Added
                                </Text>
                                <Text size="xl" fw={700} className="text-bright-sun-400">
                                    {totalQuestions}
                                </Text>
                            </div>
                            <IconPencil size={32} className="text-bright-sun-400" />
                        </Group>
                        <Badge
                            color={totalQuestions > 0 ? 'green' : 'gray'}
                            variant="light"
                        >
                            {totalQuestions > 0 ? '↑ Active' : 'No activity'}
                        </Badge>
                    </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <Card className="bg-mine-shaft-800 border border-mine-shaft-700 hover:border-bright-sun-400 transition-colors h-full">
                        <Group justify="space-between" mb="md">
                            <div>
                                <Text size="sm" c="dimmed" className="uppercase font-bold">
                                    Practice Sessions
                                </Text>
                                <Text size="xl" fw={700} className="text-blue-400">
                                    {totalPractice}
                                </Text>
                            </div>
                            <IconBookmark size={32} className="text-blue-400" />
                        </Group>
                        <Badge
                            color={totalPractice > 0 ? 'blue' : 'gray'}
                            variant="light"
                        >
                            {totalPractice > 0 ? '↑ Active' : 'No activity'}
                        </Badge>
                    </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <Card className="bg-mine-shaft-800 border border-mine-shaft-700 hover:border-bright-sun-400 transition-colors h-full">
                        <Group justify="space-between" mb="md">
                            <div>
                                <Text size="sm" c="dimmed" className="uppercase font-bold">
                                    Revision Sessions
                                </Text>
                                <Text size="xl" fw={700} className="text-green-400">
                                    {totalRevisions}
                                </Text>
                            </div>
                            <IconRefresh size={32} className="text-green-400" />
                        </Group>
                        <Badge
                            color={totalRevisions > 0 ? 'green' : 'gray'}
                            variant="light"
                        >
                            {totalRevisions > 0 ? '↑ Active' : 'No activity'}
                        </Badge>
                    </Card>
                </Grid.Col>
            </Grid>

            {/* Activity Chart */}
            {dailyActivityStats.length > 0 && (
                <Card className="bg-mine-shaft-900 border border-mine-shaft-700 shadow-lg p-6">
                    <Text size="lg" fw={700} mb="md" className="text-bright-sun-400">
                        Activity Timeline
                    </Text>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dailyActivityStats}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis
                                dataKey="date"
                                stroke="#999"
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis stroke="#999" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#2d2d2d',
                                    border: '1px solid #555',
                                    borderRadius: '8px',
                                }}
                                labelStyle={{ color: '#fff' }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="questionsAdded"
                                stroke="#ffbd20"
                                strokeWidth={2}
                                name="Questions Added"
                                dot={{ fill: '#ffbd20', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="practiceSessions"
                                stroke="#40c057"
                                strokeWidth={2}
                                name="Practice Sessions"
                                dot={{ fill: '#40c057', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="revisionsSessions"
                                stroke="#748ffc"
                                strokeWidth={2}
                                name="Revision Sessions"
                                dot={{ fill: '#748ffc', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            )}

            {/* Empty State */}
            {dailyActivityStats.length === 0 && !loading && (
                <Card className="bg-mine-shaft-800 text-center py-12 border border-mine-shaft-700">
                    <Text size="lg" c="dimmed">
                        No activity data available for the selected date range.
                    </Text>
                    <Text size="sm" c="dimmed" mt="xs">
                        Start practicing questions to see your activity here!
                    </Text>
                </Card>
            )}

            {/* Performance Summary */}
            {performanceSummary && (
                <Card className="bg-mine-shaft-900 border border-mine-shaft-700 shadow-lg p-6">
                    <Text size="lg" fw={700} mb="md" className="text-bright-sun-400">
                        Performance Summary
                    </Text>
                    <Grid>
                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <div className="text-center">
                                <Text size="sm" c="dimmed" mb="xs">
                                    Total Questions Solved
                                </Text>
                                <Text size="xl" fw={700} className="text-bright-sun-400">
                                    {performanceSummary.totalQuestionsSolved || 0}
                                </Text>
                            </div>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <div className="text-center">
                                <Text size="sm" c="dimmed" mb="xs">
                                    Accuracy Rate
                                </Text>
                                <Text size="xl" fw={700} className="text-green-400">
                                    {performanceSummary.accuracyRate || 0}%
                                </Text>
                            </div>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <div className="text-center">
                                <Text size="sm" c="dimmed" mb="xs">
                                    Quizzes Completed
                                </Text>
                                <Text size="xl" fw={700} className="text-blue-400">
                                    {performanceSummary.quizzesCompleted || 0}
                                </Text>
                            </div>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <div className="text-center">
                                <Text size="sm" c="dimmed" mb="xs">
                                    Time Spent
                                </Text>
                                <Text size="xl" fw={700} className="text-purple-400">
                                    {Math.round(
                                        (performanceSummary.timeSpentMinutes || 0) / 60
                                    )}h
                                </Text>
                            </div>
                        </Grid.Col>
                    </Grid>
                </Card>
            )}
        </div>
    );
};

export default ActivityDashboard;
