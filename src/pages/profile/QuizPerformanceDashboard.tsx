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
    Skeleton,
    Grid,
    Table,
    Tabs,
} from '@mantine/core';
import {
    IconTarget,
    IconTrendingUp,
    IconBook,
    IconChartBar,
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

const COLORS = ['#ffbd20', '#40c057', '#748ffc', '#ff6b6b', '#4c6ef5'];

const MetricCard = ({ label, value, icon: Icon, color, sub }: any) => (
    <Card className="bg-mine-shaft-800 border border-mine-shaft-700 hover:border-bright-sun-400 transition-colors h-full">
        <Group justify="space-between" mb="sm">
            <div>
                <Text size="xs" c="dimmed" className="uppercase font-bold tracking-wide">{label}</Text>
                <Text size="xl" fw={700} style={{ color }}>{value}</Text>
                {sub && <Text size="xs" c="dimmed" mt={2}>{sub}</Text>}
            </div>
            <Icon size={32} style={{ color }} />
        </Group>
    </Card>
);

const QuizPerformanceDashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {
        quizPerformanceStats,
        subjectWisePerformance,
        difficultyWisePerformance,
        loadingStats,
    } = useSelector((state: RootState) => state.performance as any);

    const [dateRange, setLocalDateRange] = useState<[Date | null, Date | null]>([
        new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        new Date(),
    ]);

    const [activeTab, setActiveTab] = useState<string | null>('overview');

    useEffect(() => {
        // Guard: skip dispatch if either date is null (user cleared the picker)
        if (!dateRange[0] || !dateRange[1]) return;
        const startDate = dateRange[0].toISOString().split('T')[0];
        const endDate = dateRange[1].toISOString().split('T')[0];
        dispatch(setDateRange({ startDate, endDate }));
        dispatch(getQuizPerformanceStats({ startDate, endDate }));
        dispatch(getSubjectWisePerformance({ startDate, endDate }));
        dispatch(getDifficultyWisePerformance({ startDate, endDate }));
    }, [dispatch, dateRange]);

    const stats = quizPerformanceStats || [];
    const totalQuizzes = stats.length;

    // Guard against empty arrays for Math.min / Math.max
    const avgScore = totalQuizzes > 0
        ? Math.round(stats.reduce((s: number, q: any) => s + (q.percentage || 0), 0) / totalQuizzes)
        : 0;
    const maxScore = totalQuizzes > 0 ? Math.max(...stats.map((q: any) => q.percentage || 0)) : 0;
    const minScore = totalQuizzes > 0 ? Math.min(...stats.map((q: any) => q.percentage || 0)) : 0;
    const passedQuizzes = stats.filter((q: any) => q.percentage >= 60).length;

    // Score trend data: chronological order for line chart
    const scoreTrend = [...stats]
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((q: any, i: number) => ({
            attempt: `#${i + 1}`,
            Score: q.percentage,
            Quiz: q.quizTitle,
        }));

    return (
        <div className="max-w-7xl mx-auto space-y-6 pt-20 pb-12 px-4">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-bright-sun-400 mb-1">Quiz Performance</h1>
                <p className="text-mine-shaft-400 text-sm">Analyze your quiz results and track score trends</p>
            </div>

            {/* Date Range Picker */}
            <Card className="bg-mine-shaft-900 border border-mine-shaft-700 p-4">
                <Group>
                    <DatePickerInput
                        type="range"
                        label="Date Range"
                        placeholder="Pick a date range"
                        value={dateRange}
                        onChange={(value) => setLocalDateRange(value as [Date | null, Date | null])}
                        clearable
                        style={{ minWidth: 260 }}
                    />
                    {!dateRange[0] && (
                        <Text size="sm" c="dimmed" mt="md">Select a date range to view performance data.</Text>
                    )}
                </Group>
            </Card>

            {/* Key Metrics */}
            <Grid>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    {loadingStats ? <Skeleton height={100} radius="md" /> : (
                        <MetricCard label="Total Quizzes" value={totalQuizzes} icon={IconTarget} color="#ffbd20" />
                    )}
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    {loadingStats ? <Skeleton height={100} radius="md" /> : (
                        <MetricCard label="Average Score" value={`${avgScore}%`} icon={IconTrendingUp} color="#40c057" />
                    )}
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    {loadingStats ? <Skeleton height={100} radius="md" /> : (
                        <MetricCard
                            label="Pass Rate"
                            value={totalQuizzes > 0 ? `${Math.round((passedQuizzes / totalQuizzes) * 100)}%` : '—'}
                            icon={IconChartBar}
                            color="#4dabf7"
                            sub={`${passedQuizzes} / ${totalQuizzes} passed`}
                        />
                    )}
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    {loadingStats ? <Skeleton height={100} radius="md" /> : (
                        <MetricCard
                            label="Score Range"
                            value={totalQuizzes > 0 ? `${minScore}–${maxScore}%` : '—'}
                            icon={IconBook}
                            color="#da77f2"
                        />
                    )}
                </Grid.Col>
            </Grid>

            {/* Score Trend */}
            {!loadingStats && scoreTrend.length > 1 && (
                <Card className="bg-mine-shaft-900 border border-mine-shaft-700 shadow-lg p-6">
                    <Text size="lg" fw={700} mb="md" className="text-bright-sun-400">Score Trend</Text>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={scoreTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="attempt" stroke="#999" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#999" domain={[0, 100]} style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#2d2d2d', border: '1px solid #555', borderRadius: '8px' }}
                                labelStyle={{ color: '#fff' }}
                                formatter={(val: any, name: any, props: any) => [`${val}%`, props.payload.Quiz || name]}
                            />
                            <Line type="monotone" dataKey="Score" stroke="#ffbd20" strokeWidth={2} dot={{ fill: '#ffbd20', r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            )}

            {/* Charts and Analysis Tabs */}
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
                                <Text size="lg" fw={700} mb="md" className="text-bright-sun-400">Quiz Score Distribution</Text>
                                {loadingStats ? <Skeleton height={280} radius="md" /> : stats.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={280}>
                                        <BarChart data={stats.slice(0, 10)}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                            <XAxis dataKey="quizTitle" stroke="#999" angle={-35} textAnchor="end" height={70} interval={0} tick={{ fontSize: 10 }} />
                                            <YAxis stroke="#999" domain={[0, 100]} />
                                            <Tooltip contentStyle={{ backgroundColor: '#2d2d2d', border: '1px solid #555' }} labelStyle={{ color: '#fff' }} />
                                            <Bar dataKey="percentage" fill="#ffbd20" radius={[4, 4, 0, 0]} name="Score %" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : <Text c="dimmed" ta="center" py="xl">No quiz data for this range</Text>}
                            </Card>
                        </Grid.Col>

                        <Grid.Col span={{ base: 12, md: 6 }}>
                            <Card className="bg-mine-shaft-900 border border-mine-shaft-700 shadow-lg p-6">
                                <Text size="lg" fw={700} mb="md" className="text-bright-sun-400">Pass / Fail Ratio</Text>
                                {loadingStats ? <Skeleton height={280} radius="md" /> : (
                                    <ResponsiveContainer width="100%" height={280}>
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: 'Passed', value: passedQuizzes, color: '#40c057' },
                                                    { name: 'Failed', value: Math.max(0, totalQuizzes - passedQuizzes), color: '#ff6b6b' },
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, value }: any) => value > 0 ? `${name}: ${value}` : ''}
                                                outerRadius={90}
                                                dataKey="value"
                                            >
                                                {['#40c057', '#ff6b6b'].map((color, i) => (
                                                    <Cell key={i} fill={color} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: '#2d2d2d', border: '1px solid #555' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </Card>
                        </Grid.Col>
                    </Grid>
                </Tabs.Panel>

                <Tabs.Panel value="subject" pt="xl">
                    <Card className="bg-mine-shaft-900 border border-mine-shaft-700 shadow-lg p-6">
                        <Text size="lg" fw={700} mb="md" className="text-bright-sun-400">Subject-Wise Performance</Text>
                        {loadingStats ? <Skeleton height={350} radius="md" /> : (subjectWisePerformance || []).length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={320}>
                                    <RadarChart data={subjectWisePerformance}>
                                        <PolarGrid stroke="#444" />
                                        <PolarAngleAxis dataKey="subject" stroke="#999" tick={{ fontSize: 12 }} />
                                        <PolarRadiusAxis stroke="#999" />
                                        <Radar name="Avg Score" dataKey="averageScore" stroke="#ffbd20" fill="#ffbd20" fillOpacity={0.55} />
                                        <Tooltip contentStyle={{ backgroundColor: '#2d2d2d', border: '1px solid #555' }} />
                                        <Legend />
                                    </RadarChart>
                                </ResponsiveContainer>
                                <Table striped mt="lg">
                                    <Table.Thead className="bg-mine-shaft-950">
                                        <Table.Tr>
                                            <Table.Th>Subject</Table.Th>
                                            <Table.Th>Quizzes</Table.Th>
                                            <Table.Th>Avg Score</Table.Th>
                                            <Table.Th>Best Score</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {(subjectWisePerformance || []).map((s: any, i: number) => (
                                            <Table.Tr key={i} className="hover:bg-mine-shaft-800">
                                                <Table.Td fw={500}>{s.subject}</Table.Td>
                                                <Table.Td>{s.quizzesTaken}</Table.Td>
                                                <Table.Td>
                                                    <Badge color={s.averageScore >= 70 ? 'green' : s.averageScore >= 50 ? 'yellow' : 'red'}>
                                                        {s.averageScore}%
                                                    </Badge>
                                                </Table.Td>
                                                <Table.Td><Text fw={600}>{s.bestScore}%</Text></Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            </>
                        ) : <Text c="dimmed" ta="center" py="xl">No subject data available</Text>}
                    </Card>
                </Tabs.Panel>

                <Tabs.Panel value="difficulty" pt="xl">
                    <Card className="bg-mine-shaft-900 border border-mine-shaft-700 shadow-lg p-6">
                        <Text size="lg" fw={700} mb="md" className="text-bright-sun-400">Difficulty-Wise Performance</Text>
                        {loadingStats ? <Skeleton height={300} radius="md" /> : (difficultyWisePerformance || []).length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={260}>
                                    <BarChart data={difficultyWisePerformance}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                        <XAxis dataKey="difficulty" stroke="#999" />
                                        <YAxis stroke="#999" />
                                        <Tooltip contentStyle={{ backgroundColor: '#2d2d2d', border: '1px solid #555' }} />
                                        <Legend />
                                        <Bar dataKey="averageScore" fill="#40c057" name="Avg Score" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="accuracy" fill="#748ffc" name="Accuracy %" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                                <Table striped mt="lg">
                                    <Table.Thead className="bg-mine-shaft-950">
                                        <Table.Tr>
                                            <Table.Th>Difficulty</Table.Th>
                                            <Table.Th>Questions</Table.Th>
                                            <Table.Th>Correct</Table.Th>
                                            <Table.Th>Accuracy</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {(difficultyWisePerformance || []).map((d: any, i: number) => (
                                            <Table.Tr key={i} className="hover:bg-mine-shaft-800">
                                                <Table.Td fw={500}>
                                                    <Badge color={d.difficulty === 'Easy' ? 'green' : d.difficulty === 'Medium' ? 'yellow' : 'red'}>
                                                        {d.difficulty}
                                                    </Badge>
                                                </Table.Td>
                                                <Table.Td>{d.questionsSolved}</Table.Td>
                                                <Table.Td>{d.correctAnswers}</Table.Td>
                                                <Table.Td><Text fw={600}>{d.accuracy}%</Text></Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            </>
                        ) : <Text c="dimmed" ta="center" py="xl">No difficulty data available</Text>}
                    </Card>
                </Tabs.Panel>

                <Tabs.Panel value="details" pt="xl">
                    <Card className="bg-mine-shaft-900 border border-mine-shaft-700 shadow-lg overflow-hidden">
                        <Text size="lg" fw={700} mb="md" className="text-bright-sun-400 p-6 pb-0">Quiz Details</Text>
                        {loadingStats ? <Skeleton height={200} radius="md" mx="lg" mb="lg" /> : stats.length > 0 ? (
                            <Table striped>
                                <Table.Thead className="bg-mine-shaft-950">
                                    <Table.Tr>
                                        <Table.Th>Quiz Title</Table.Th>
                                        <Table.Th>Score</Table.Th>
                                        <Table.Th>Percentage</Table.Th>
                                        <Table.Th>Time</Table.Th>
                                        <Table.Th>Date</Table.Th>
                                        <Table.Th>Status</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {stats.map((q: any, i: number) => (
                                        <Table.Tr key={i} className="hover:bg-mine-shaft-800">
                                            <Table.Td fw={500}>{q.quizTitle}</Table.Td>
                                            <Table.Td>{q.score}/{q.totalQuestions}</Table.Td>
                                            <Table.Td>
                                                <Badge color={q.percentage >= 70 ? 'green' : q.percentage >= 50 ? 'yellow' : 'red'}>
                                                    {q.percentage}%
                                                </Badge>
                                            </Table.Td>
                                            <Table.Td>{q.timeTaken ? `${Math.round(q.timeTaken / 60)}m` : '—'}</Table.Td>
                                            <Table.Td>{q.date}</Table.Td>
                                            <Table.Td>
                                                <Badge color={q.percentage >= 60 ? 'green' : 'red'}>
                                                    {q.percentage >= 60 ? 'Passed' : 'Failed'}
                                                </Badge>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        ) : <Text c="dimmed" ta="center" py="xl">No quiz data for this range</Text>}
                    </Card>
                </Tabs.Panel>
            </Tabs>
        </div>
    );
};

export default QuizPerformanceDashboard;
