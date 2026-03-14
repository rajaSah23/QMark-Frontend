import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/layout';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge, Button, Card, Group, Loader, SegmentedControl, Table, Text, Textarea } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import apiClient, { toast } from '../../../utils/APIClient';

type RangePreset = 'today' | 'week' | 'month' | 'custom';

const getRangeForPreset = (preset: RangePreset): [Date | null, Date | null] => {
    const now = new Date();
    const end = new Date(now);
    const start = new Date(now);

    if (preset === 'today') return [start, end];
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

const QuestionInsightDetailPage = () => {
    const { questionId } = useParams();
    const navigate = useNavigate();

    const [preset, setPreset] = useState<RangePreset>('week');
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>(getRangeForPreset('week'));
    const [loading, setLoading] = useState(true);
    const [savingComment, setSavingComment] = useState(false);
    const [detail, setDetail] = useState<any>(null);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (preset !== 'custom') {
            setDateRange(getRangeForPreset(preset));
        }
    }, [preset]);

    const query = useMemo(() => {
        const payload: Record<string, string> = {};
        if (dateRange[0]) payload.startDate = dateRange[0].toISOString().split('T')[0];
        if (dateRange[1]) payload.endDate = dateRange[1].toISOString().split('T')[0];
        return payload;
    }, [dateRange]);

    const fetchDetail = async () => {
        if (!questionId) return;
        setLoading(true);
        try {
            const response = await apiClient.GET(`/mcq/${questionId}/interactions`, query);
            setDetail(response.data?.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!query.startDate || !query.endDate) return;
        fetchDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [questionId, query]);

    const handleAddComment = async () => {
        if (!questionId || !comment.trim()) return;
        setSavingComment(true);
        try {
            const response = await apiClient.POST(`/mcq/${questionId}/comments`, { comment: comment.trim() });
            setDetail((prev: any) => ({
                ...prev,
                comments: response.data?.data || []
            }));
            setComment('');
            toast.success('Comment added');
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to add comment');
        } finally {
            setSavingComment(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto pt-20 pb-12 px-4 space-y-6">
                <Group justify="space-between">
                    <div>
                        <h1 className="text-3xl font-bold text-bright-sun-400">Question Detail</h1>
                        <p className="text-mine-shaft-400 text-sm">Review click history and maintain notes for this question.</p>
                    </div>
                    <Button variant="subtle" color="gray" onClick={() => navigate('/questions/analytics')}>
                        Back to Matrix
                    </Button>
                </Group>

                <Card className="bg-mine-shaft-900 border border-mine-shaft-700">
                    <div className="grid grid-cols-1 xl:grid-cols-[minmax(280px,420px)_320px] gap-4 items-end">
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
                    </div>
                </Card>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader /></div>
                ) : !detail ? (
                    <Card className="bg-mine-shaft-900 border border-mine-shaft-700 text-center py-12">
                        <Text c="dimmed">Unable to load question analytics.</Text>
                    </Card>
                ) : (
                    <>
                        <Card className="bg-mine-shaft-900 border border-mine-shaft-700">
                            <Group gap="xs" mb="md">
                                {detail?.question?.subject?.subject && <Badge color="blue" variant="light">{detail.question.subject.subject}</Badge>}
                                {detail?.question?.topic?.topic && <Badge color="grape" variant="light">{detail.question.topic.topic}</Badge>}
                                <Badge color={detail?.question?.difficulty === 'hard' ? 'red' : detail?.question?.difficulty === 'medium' ? 'yellow' : 'green'} variant="outline">
                                    {detail?.question?.difficulty || 'easy'}
                                </Badge>
                            </Group>
                            <Text fw={700} size="lg">
                                <div dangerouslySetInnerHTML={{ __html: detail?.question?.question || '' }} />
                            </Text>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card className="bg-mine-shaft-900 border border-mine-shaft-700">
                                <Text size="sm" c="dimmed">Total Clicks</Text>
                                <Text size="xl" fw={700}>{detail?.summary?.totalClicks || 0}</Text>
                            </Card>
                            <Card className="bg-mine-shaft-900 border border-mine-shaft-700">
                                <Text size="sm" c="dimmed">Correct</Text>
                                <Text size="xl" fw={700}>{detail?.summary?.correctClicks || 0}</Text>
                            </Card>
                            <Card className="bg-mine-shaft-900 border border-mine-shaft-700">
                                <Text size="sm" c="dimmed">Wrong</Text>
                                <Text size="xl" fw={700}>{detail?.summary?.incorrectClicks || 0}</Text>
                            </Card>
                            <Card className="bg-mine-shaft-900 border border-mine-shaft-700">
                                <Text size="sm" c="dimmed">Accuracy</Text>
                                <Text size="xl" fw={700}>{detail?.summary?.accuracy || 0}%</Text>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6">
                            <Card className="bg-mine-shaft-900 border border-mine-shaft-700">
                                <Text fw={700} mb="md" className="text-bright-sun-400">Past Clicks</Text>
                                {(detail?.clickHistory || []).length > 0 ? (
                                    <Table striped highlightOnHover withTableBorder>
                                        <Table.Thead>
                                            <Table.Tr>
                                                <Table.Th>Selected Option</Table.Th>
                                                <Table.Th>Result</Table.Th>
                                                <Table.Th>Clicked At</Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            {detail.clickHistory.map((item: any) => (
                                                <Table.Tr key={item._id}>
                                                    <Table.Td>{item.selectedAnswer}</Table.Td>
                                                    <Table.Td>
                                                        <Badge color={item.isCorrect ? 'green' : 'red'} variant="light">
                                                            {item.isCorrect ? 'Correct' : 'Wrong'}
                                                        </Badge>
                                                    </Table.Td>
                                                    <Table.Td>{formatDate(item.createdAt)}</Table.Td>
                                                </Table.Tr>
                                            ))}
                                        </Table.Tbody>
                                    </Table>
                                ) : (
                                    <div className="py-10 text-center text-mine-shaft-400">
                                        No clicks found for the selected period.
                                    </div>
                                )}
                            </Card>

                            <div className="space-y-6">
                                <Card className="bg-mine-shaft-900 border border-mine-shaft-700">
                                    <Text fw={700} mb="md" className="text-bright-sun-400">Option Breakdown</Text>
                                    <div className="space-y-3">
                                        {(detail?.optionBreakdown || []).map((item: any) => (
                                            <div key={item.option} className="rounded-md border border-mine-shaft-700 p-3">
                                                <Text fw={600}>{item.option}</Text>
                                                <Group gap="xs" mt="sm">
                                                    <Badge variant="light" color="blue">{item.clicks} clicks</Badge>
                                                    <Badge variant="light" color="green">{item.correct} correct</Badge>
                                                    <Badge variant="light" color="red">{item.incorrect} wrong</Badge>
                                                </Group>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                <Card className="bg-mine-shaft-900 border border-mine-shaft-700">
                                    <Text fw={700} mb="md" className="text-bright-sun-400">Comments</Text>
                                    <Textarea
                                        placeholder="Add a note or observation for this question"
                                        value={comment}
                                        onChange={(event) => setComment(event.currentTarget.value)}
                                        minRows={3}
                                    />
                                    <Button mt="md" color="green" onClick={handleAddComment} loading={savingComment}>
                                        Add Comment
                                    </Button>

                                    <div className="space-y-3 mt-5">
                                        {(detail?.comments || []).length > 0 ? detail.comments.map((item: any) => (
                                            <div key={item._id} className="rounded-md border border-mine-shaft-700 p-3">
                                                <div className="flex items-center justify-between gap-3">
                                                    <Text fw={600}>{item?.user?.name || item?.user?.email || 'You'}</Text>
                                                    <Text size="xs" c="dimmed">{formatDate(item.createdAt)}</Text>
                                                </div>
                                                <Text mt="sm">{item.comment}</Text>
                                            </div>
                                        )) : (
                                            <Text c="dimmed">No comments added yet.</Text>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default QuestionInsightDetailPage;
