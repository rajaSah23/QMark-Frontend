import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/layout';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getQuestionInteractionSummary } from '../../store/action/question-action';
import { getSubjectList } from '../../store/action/master-action';
import { Badge, Button, Card, Group, Loader, SegmentedControl, Select, Table, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useNavigate } from 'react-router-dom';

type RangePreset = 'today' | 'week' | 'month' | 'custom';

const getRangeForPreset = (preset: RangePreset): [Date | null, Date | null] => {
    const now = new Date();
    const end = new Date(now);
    const start = new Date(now);

    if (preset === 'today') {
        return [start, end];
    }

    if (preset === 'week') {
        start.setDate(now.getDate() - 6);
        return [start, end];
    }

    if (preset === 'month') {
        start.setDate(now.getDate() - 29);
        return [start, end];
    }

    return [null, null];
};

const formatDate = (value?: string | null) => {
    if (!value) return '—';
    return new Date(value).toLocaleString();
};

const QuestionAnalyticsPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { analyticsSummary, loadingAnalytics } = useSelector((state: RootState) => state.questions as any);
    const { subjectList } = useSelector((state: RootState) => state.master as any);

    const [preset, setPreset] = useState<RangePreset>('week');
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>(getRangeForPreset('week'));
    const [subject, setSubject] = useState<string | null>('');

    useEffect(() => {
        dispatch(getSubjectList());
    }, [dispatch]);

    useEffect(() => {
        if (preset !== 'custom') {
            setDateRange(getRangeForPreset(preset));
        }
    }, [preset]);

    const query = useMemo(() => {
        const payload: Record<string, string> = {};
        if (dateRange[0]) payload.startDate = dateRange[0].toISOString().split('T')[0];
        if (dateRange[1]) payload.endDate = dateRange[1].toISOString().split('T')[0];
        if (subject) payload.subject = subject;
        return payload;
    }, [dateRange, subject]);

    useEffect(() => {
        if (!query.startDate || !query.endDate) return;
        dispatch(getQuestionInteractionSummary(query));
    }, [dispatch, query]);

    return (
        <Layout>
            <div className="max-w-7xl mx-auto pt-20 pb-12 px-4 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-bold text-bright-sun-400">Question Analytics</h1>
                        <p className="text-mine-shaft-400 text-sm">Track question option clicks by date range and subject.</p>
                    </div>
                    <Button variant="subtle" color="gray" onClick={() => navigate('/questions')}>
                        Back to Questions
                    </Button>
                </div>

                <Card className="bg-mine-shaft-900 border border-mine-shaft-700">
                    <div className="grid grid-cols-1 xl:grid-cols-[minmax(280px,420px)_320px_260px] gap-4 items-end">
                        <div className="space-y-2">
                            <Text size="sm" fw={600} c="dimmed">Quick Range</Text>
                            <SegmentedControl
                                fullWidth
                                radius="md"
                                size="md"
                                value={preset}
                                onChange={(value) => setPreset(value as RangePreset)}
                                data={[
                                    { label: 'Today', value: 'today' },
                                    { label: 'This Week', value: 'week' },
                                    { label: 'This Month', value: 'month' },
                                    { label: 'Custom', value: 'custom' },
                                ]}
                            />
                        </div>
                        <DatePickerInput
                            type="range"
                            label="Date Range"
                            placeholder="Pick a date range"
                            value={dateRange}
                            onChange={(value) => {
                                setPreset('custom');
                                setDateRange(value as [Date | null, Date | null]);
                            }}
                            disabled={preset !== 'custom'}
                            clearable
                        />
                        <Select
                            label="Subject Filter"
                            placeholder="All subjects"
                            data={(subjectList || []).map((item: any) => ({
                                value: item._id,
                                label: item.subject
                            }))}
                            value={subject}
                            onChange={setSubject}
                            clearable
                            searchable
                        />
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-mine-shaft-900 border border-mine-shaft-700">
                        <Text size="sm" c="dimmed">Total Clicks</Text>
                        <Text size="xl" fw={700}>{loadingAnalytics ? '...' : analyticsSummary?.totalClicks || 0}</Text>
                    </Card>
                    <Card className="bg-mine-shaft-900 border border-mine-shaft-700">
                        <Text size="sm" c="dimmed">Questions Attempted</Text>
                        <Text size="xl" fw={700}>{loadingAnalytics ? '...' : analyticsSummary?.uniqueQuestionsAttempted || 0}</Text>
                    </Card>
                    <Card className="bg-mine-shaft-900 border border-mine-shaft-700">
                        <Text size="sm" c="dimmed">Correct vs Wrong</Text>
                        <Group mt="sm">
                            <Badge color="green" variant="light">{analyticsSummary?.correctClicks || 0} correct</Badge>
                            <Badge color="red" variant="light">{analyticsSummary?.incorrectClicks || 0} wrong</Badge>
                        </Group>
                    </Card>
                    <Card className="bg-mine-shaft-900 border border-mine-shaft-700">
                        <Text size="sm" c="dimmed">Accuracy</Text>
                        <Text size="xl" fw={700}>{loadingAnalytics ? '...' : `${analyticsSummary?.accuracy || 0}%`}</Text>
                    </Card>
                </div>

                <Card className="bg-mine-shaft-900 border border-mine-shaft-700">
                    <Group justify="space-between" mb="md">
                        <Text fw={700} className="text-bright-sun-400">Interaction Matrix</Text>
                        {loadingAnalytics && <Loader size="sm" />}
                    </Group>

                    {(analyticsSummary?.questionBreakdown || []).length > 0 ? (
                        <Table striped highlightOnHover withTableBorder>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Question</Table.Th>
                                    <Table.Th>Subject</Table.Th>
                                    <Table.Th>Clicks</Table.Th>
                                    <Table.Th>Correct</Table.Th>
                                    <Table.Th>Wrong</Table.Th>
                                    <Table.Th>Accuracy</Table.Th>
                                    <Table.Th>Last Click</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {analyticsSummary.questionBreakdown.map((item: any) => (
                                    <Table.Tr
                                        key={item.questionId}
                                        className="cursor-pointer"
                                        onClick={() => navigate(`/questions/${item.questionId}`)}
                                    >
                                        <Table.Td>
                                            <div
                                                className="line-clamp-2 max-w-[440px]"
                                                dangerouslySetInnerHTML={{ __html: item.question }}
                                            />
                                        </Table.Td>
                                        <Table.Td>{item.subject}</Table.Td>
                                        <Table.Td>{item.totalClicks}</Table.Td>
                                        <Table.Td>{item.correctClicks}</Table.Td>
                                        <Table.Td>{item.incorrectClicks}</Table.Td>
                                        <Table.Td>{item.accuracy}%</Table.Td>
                                        <Table.Td>{formatDate(item.lastClickedAt)}</Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    ) : (
                        <div className="py-12 text-center text-mine-shaft-400">
                            No interaction data found for the selected filters.
                        </div>
                    )}
                </Card>
            </div>
        </Layout>
    );
};

export default QuestionAnalyticsPage;
