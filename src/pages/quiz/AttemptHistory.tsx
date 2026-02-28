import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getAttempts, getQuizById } from '../../store/action/quiz-action';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Text, Group, Badge, Loader, Table } from '@mantine/core';
import { IconArrowLeft, IconEye } from '@tabler/icons-react';

const AttemptHistory = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    
    const { attempts, currentQuiz, loading } = useSelector((state: RootState) => state.quiz as any);

    useEffect(() => {
        if (quizId) {
            dispatch(getAttempts(quizId));
            dispatch(getQuizById(quizId)); // Get quiz title
        }
    }, [dispatch, quizId]);

    if (loading) return <div className="flex justify-center items-center h-64"><Loader /></div>;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pt-6">
            <Group justify="space-between">
                <div>
                    <Button variant="subtle" color="gray" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate('/quiz')} mb="sm">
                        Back to Quizzes
                    </Button>
                    <h1 className="text-2xl font-bold text-bright-sun-400 m-0">
                        Attempt History: {currentQuiz?.title || 'Loading...'}
                    </h1>
                </div>
                <Button color="green" onClick={() => navigate(`/quiz/${quizId}/attempt`)}>
                    Take Quiz Again
                </Button>
            </Group>

            {attempts?.length === 0 ? (
                <Card className="bg-mine-shaft-800 text-center py-12 border-none">
                    <Text size="lg" c="dimmed">You haven't taken this quiz yet.</Text>
                    <Button mt="md" color="green" onClick={() => navigate(`/quiz/${quizId}/attempt`)}>
                        Start First Attempt
                    </Button>
                </Card>
            ) : (
                <Card className="bg-mine-shaft-900 border border-mine-shaft-700 shadow-xl overflow-hidden p-0">
                    <Table striped highlightOnHover verticalSpacing="md" horizontalSpacing="lg">
                        <Table.Thead className="bg-mine-shaft-950">
                            <Table.Tr>
                                <Table.Th>Date & Time</Table.Th>
                                <Table.Th>Score</Table.Th>
                                <Table.Th>Percentage</Table.Th>
                                <Table.Th>Duration</Table.Th>
                                <Table.Th style={{ width: 100 }}></Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {attempts?.map((attempt: any) => (
                                <Table.Tr key={attempt._id} className="border-b border-mine-shaft-800 hover:bg-mine-shaft-800 cursor-pointer" onClick={() => navigate(`/quiz/${quizId}/result/${attempt._id}`)}>
                                    <Table.Td>
                                        <Text fw={500}>{formatDate(attempt.createdAt)}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text fw={700}>{attempt.score} / {attempt.totalQuestions}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge 
                                            size="lg" 
                                            color={attempt.percentage >= 80 ? 'green' : attempt.percentage >= 60 ? 'yellow' : 'red'}
                                        >
                                            {attempt.percentage}%
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        {Math.round(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s
                                    </Table.Td>
                                    <Table.Td>
                                        <Button 
                                            variant="light" 
                                            size="xs" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/quiz/${quizId}/result/${attempt._id}`);
                                            }}
                                            leftSection={<IconEye size={14} />}
                                        >
                                            Review
                                        </Button>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Card>
            )}
        </div>
    );
};

export default AttemptHistory;
