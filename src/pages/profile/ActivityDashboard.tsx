import React, { useEffect, useMemo, useState } from 'react';
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
    Skeleton,
    Grid,
    Progress,
    Tooltip,
} from '@mantine/core';
import {
    IconFlame,
    IconPencil,
    IconRefresh,
    IconTrendingUp,
    IconBook,
    IconTargetArrow,
} from '@tabler/icons-react';
import { DatePickerInput } from '@mantine/dates';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ReTooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

// ─── Activity Heatmap (GitHub-style) ──────────────────────────────────────────
const ActivityHeatmap = ({ data }: { data: any[] }) => {
    const dateMap = useMemo(() => {
        const m: Record<string, number> = {};
        data.forEach(d => { m[d.date] = d.totalActivity || 0; });
        return m;
    }, [data]);

    // Build last 15 weeks (105 days)
    const weeks: string[][] = [];
    const today = new Date();
    // Go back to the Sunday of 14 weeks ago
    const startDay = new Date(today);
    startDay.setDate(startDay.getDate() - 104);

    let week: string[] = [];
    for (let i = 0; i < 105; i++) {
        const d = new Date(startDay);
        d.setDate(startDay.getDate() + i);
        const ds = d.toISOString().split('T')[0];
        week.push(ds);
        if (week.length === 7) { weeks.push(week); week = []; }
    }
    if (week.length) weeks.push(week);

    const getColor = (count: number) => {
        if (count === 0) return 'bg-mine-shaft-800';
        if (count < 3) return 'bg-green-900';
        if (count < 6) return 'bg-green-700';
        if (count < 10) return 'bg-green-500';
        return 'bg-green-400';
    };

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="overflow-x-auto">
            <div className="flex gap-1" style={{ minWidth: weeks.length * 14 }}>
                {/* Day labels */}
                <div className="flex flex-col gap-1 mr-1">
                    {dayLabels.map((d, i) => (
                        <div key={i} className="h-3 w-7 text-mine-shaft-500 text-[9px] flex items-center">{i % 2 === 1 ? d : ''}</div>
                    ))}
                </div>
                {weeks.map((wk, wi) => (
                    <div key={wi} className="flex flex-col gap-1">
                        {wk.map((ds, di) => {
                            const count = dateMap[ds] || 0;
                            return (
                                <Tooltip key={di} label={`${ds}: ${count} activities`} withArrow>
                                    <div className={`h-3 w-3 rounded-sm ${getColor(count)} cursor-default`} />
                                </Tooltip>
                            );
                        })}
                    </div>
                ))}
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-mine-shaft-400">
                <span>Less</span>
                {['bg-mine-shaft-800', 'bg-green-900', 'bg-green-700', 'bg-green-500', 'bg-green-400'].map((c, i) => (
                    <div key={i} className={`h-3 w-3 rounded-sm ${c}`} />
                ))}
                <span>More</span>
            </div>
        </div>
    );
};

// ─── Weekly Comparison ────────────────────────────────────────────────────────
const buildWeeklyComparison = (data: any[]) => {
    const now = new Date();
    const thisWeekStart = new Date(now);
    thisWeekStart.setDate(now.getDate() - now.getDay());
    const prevWeekStart = new Date(thisWeekStart);
    prevWeekStart.setDate(thisWeekStart.getDate() - 7);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days.map((day, i) => {
        const thisDate = new Date(thisWeekStart);
        thisDate.setDate(thisWeekStart.getDate() + i);
        const prevDate = new Date(prevWeekStart);
        prevDate.setDate(prevWeekStart.getDate() + i);

        const tStr = thisDate.toISOString().split('T')[0];
        const pStr = prevDate.toISOString().split('T')[0];

        const thisDay = data.find(d => d.date === tStr);
        const prevDay = data.find(d => d.date === pStr);

        return {
            day,
            'This Week': thisDay?.totalActivity || 0,
            'Last Week': prevDay?.totalActivity || 0,
        };
    });
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <Card className="bg-mine-shaft-800 border border-mine-shaft-700 hover:border-bright-sun-400 transition-colors h-full">
        <Group justify="space-between" mb="sm">
            <div>
                <Text size="xs" c="dimmed" className="uppercase font-bold tracking-wide">{label}</Text>
                <Text size="xl" fw={700} style={{ color }}>{value}</Text>
            </div>
            <Icon size={32} style={{ color }} />
        </Group>
    </Card>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ActivityDashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { dailyActivityStats, streakRecord, performanceSummary, loadingStats, loadingMeta } =
        useSelector((state: RootState) => state.performance as any);

    const [dateRange, setLocalDateRange] = useState<[Date | null, Date | null]>([
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        new Date(),
    ]);

    useEffect(() => {
        // Guard: only dispatch if both dates are present
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

    const stats = dailyActivityStats || [];
    const totalQuestions = stats.reduce((s: number, d: any) => s + (d.questionsAdded || 0), 0);
    const totalPractice = stats.reduce((s: number, d: any) => s + (d.practiceSessions || 0), 0);
    const totalRevisions = stats.reduce((s: number, d: any) => s + (d.revisionsSessions || 0), 0);
    const activeDays = stats.filter((d: any) => d.totalActivity > 0).length;

    const currentStreak = streakRecord?.currentStreak || 0;
    const longestStreak = streakRecord?.longestStreak || 0;

    const weeklyData = buildWeeklyComparison(stats);

    return (
        <div className="max-w-7xl mx-auto space-y-6 pt-20 pb-12 px-4">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-bright-sun-400 mb-1">Daily Activity Dashboard</h1>
                <p className="text-mine-shaft-400 text-sm">Track your learning journey and activity metrics</p>
            </div>

            {/* Date Range Picker */}
            <Card className="bg-mine-shaft-900 border border-mine-shaft-700 p-4">
                <Group>
                    <DatePickerInput
                        type="range"
                        label="Date Range"
                        placeholder="Pick a date range"
                        value={dateRange}
                        onChange={(value) => {
                            const range = value as [Date | null, Date | null];
                            setLocalDateRange(range);
                        }}
                        clearable
                        style={{ minWidth: 260 }}
                    />
                    {!dateRange[0] && (
                        <Text size="sm" c="dimmed" mt="md">Select a date range to view activity data.</Text>
                    )}
                </Group>
            </Card>

            {/* Streak Cards */}
            <Grid>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    {loadingMeta ? <Skeleton height={110} radius="md" /> : (
                        <Card className="bg-gradient-to-br from-orange-950 to-orange-800 border border-orange-700 shadow-xl h-full">
                            <Group justify="space-between" mb="sm">
                                <div>
                                    <Text size="xs" c="orange.3" className="uppercase font-bold tracking-wide">Current Streak</Text>
                                    <Text size="xl" fw={700} c="white">{currentStreak} days</Text>
                                </div>
                                <IconFlame size={36} className="text-orange-300" />
                            </Group>
                            <Progress value={(currentStreak % 30) * 3.33} color="orange" size="sm" radius="xl" />
                            <Text size="xs" c="orange.3" mt="xs">Longest: {longestStreak} days</Text>
                        </Card>
                    )}
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    {loadingMeta ? <Skeleton height={110} radius="md" /> : (
                        <Card className="bg-gradient-to-br from-cyan-950 to-cyan-800 border border-cyan-700 shadow-xl h-full">
                            <Group justify="space-between" mb="sm">
                                <div>
                                    <Text size="xs" c="cyan.3" className="uppercase font-bold tracking-wide">Active Days</Text>
                                    <Text size="xl" fw={700} c="white">{activeDays}</Text>
                                </div>
                                <IconTrendingUp size={36} className="text-cyan-300" />
                            </Group>
                            <Text size="xs" c="cyan.3">Days with recorded activity in range</Text>
                        </Card>
                    )}
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    {loadingMeta ? <Skeleton height={110} radius="md" /> : (
                        <Card className="bg-gradient-to-br from-purple-950 to-purple-800 border border-purple-700 shadow-xl h-full">
                            <Group justify="space-between" mb="sm">
                                <div>
                                    <Text size="xs" c="violet.3" className="uppercase font-bold tracking-wide">Quizzes Done</Text>
                                    <Text size="xl" fw={700} c="white">{performanceSummary?.quizzesCompleted || 0}</Text>
                                </div>
                                <IconTargetArrow size={36} className="text-purple-300" />
                            </Group>
                            <Text size="xs" c="violet.3">Total quiz attempts</Text>
                        </Card>
                    )}
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    {loadingMeta ? <Skeleton height={110} radius="md" /> : (
                        <Card className="bg-gradient-to-br from-green-950 to-green-800 border border-green-700 shadow-xl h-full">
                            <Group justify="space-between" mb="sm">
                                <div>
                                    <Text size="xs" c="green.3" className="uppercase font-bold tracking-wide">Accuracy Rate</Text>
                                    <Text size="xl" fw={700} c="white">{performanceSummary?.accuracyRate || 0}%</Text>
                                </div>
                                <IconBook size={36} className="text-green-300" />
                            </Group>
                            <Progress value={performanceSummary?.accuracyRate || 0} color="green" size="sm" radius="xl" />
                            <Text size="xs" c="green.3" mt="xs">Overall answer accuracy</Text>
                        </Card>
                    )}
                </Grid.Col>
            </Grid>

            {/* Activity Metrics */}
            <Grid>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                    {loadingStats ? <Skeleton height={90} radius="md" /> : (
                        <StatCard label="Questions Added" value={totalQuestions} icon={IconPencil} color="#ffbd20" />
                    )}
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                    {loadingStats ? <Skeleton height={90} radius="md" /> : (
                        <StatCard label="Practice Sessions" value={totalPractice} icon={IconBook} color="#4dabf7" />
                    )}
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                    {loadingStats ? <Skeleton height={90} radius="md" /> : (
                        <StatCard label="Revision Sessions" value={totalRevisions} icon={IconRefresh} color="#40c057" />
                    )}
                </Grid.Col>
            </Grid>

            {/* Activity Heatmap */}
            <Card className="bg-mine-shaft-900 border border-mine-shaft-700 shadow-lg p-6">
                <Text size="lg" fw={700} mb="md" className="text-bright-sun-400">Activity Heatmap (Last 15 Weeks)</Text>
                {loadingStats ? <Skeleton height={120} radius="md" /> : (
                    <ActivityHeatmap data={stats} />
                )}
            </Card>

            {/* Activity Timeline */}
            {!loadingStats && stats.length > 0 && (
                <Card className="bg-mine-shaft-900 border border-mine-shaft-700 shadow-lg p-6">
                    <Text size="lg" fw={700} mb="md" className="text-bright-sun-400">Activity Timeline</Text>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={stats}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="date" stroke="#999" style={{ fontSize: '11px' }} />
                            <YAxis stroke="#999" style={{ fontSize: '11px' }} />
                            <ReTooltip contentStyle={{ backgroundColor: '#2d2d2d', border: '1px solid #555', borderRadius: '8px' }} labelStyle={{ color: '#fff' }} />
                            <Legend />
                            <Line type="monotone" dataKey="questionsAdded" stroke="#ffbd20" strokeWidth={2} name="Questions Added" dot={{ fill: '#ffbd20', r: 3 }} activeDot={{ r: 5 }} />
                            <Line type="monotone" dataKey="practiceSessions" stroke="#40c057" strokeWidth={2} name="Practice Sessions" dot={{ fill: '#40c057', r: 3 }} activeDot={{ r: 5 }} />
                            <Line type="monotone" dataKey="revisionsSessions" stroke="#748ffc" strokeWidth={2} name="Revision Sessions" dot={{ fill: '#748ffc', r: 3 }} activeDot={{ r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            )}

            {/* Weekly Comparison */}
            <Card className="bg-mine-shaft-900 border border-mine-shaft-700 shadow-lg p-6">
                <Text size="lg" fw={700} mb="md" className="text-bright-sun-400">Weekly Comparison</Text>
                {loadingStats ? <Skeleton height={220} radius="md" /> : (
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="day" stroke="#999" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#999" style={{ fontSize: '12px' }} />
                            <ReTooltip contentStyle={{ backgroundColor: '#2d2d2d', border: '1px solid #555', borderRadius: '8px' }} labelStyle={{ color: '#fff' }} />
                            <Legend />
                            <Bar dataKey="This Week" fill="#ffbd20" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Last Week" fill="#4dabf7" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </Card>

            {/* Empty State */}
            {!loadingStats && stats.length === 0 && dateRange[0] && (
                <Card className="bg-mine-shaft-800 text-center py-12 border border-mine-shaft-700">
                    <Text size="lg" c="dimmed">No activity data available for the selected date range.</Text>
                    <Text size="sm" c="dimmed" mt="xs">Start practicing questions to see your activity here!</Text>
                </Card>
            )}
        </div>
    );
};

export default ActivityDashboard;
