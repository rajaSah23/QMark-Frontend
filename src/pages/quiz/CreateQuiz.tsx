import React, { useState } from 'react';
import { useForm } from '@mantine/form';
import { TextInput, Textarea, Button, Switch, NumberInput, Paper, Tabs, MultiSelect, Group } from '@mantine/core';
import SubjectTopicDropdown from '../../components/dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { createQuiz } from '../../store/action/quiz-action';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import AddSubject from '../question/AddSubject';

const CreateQuiz = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string | null>('filters');
    const { loadingAction } = useSelector((state: RootState) => state.quiz as any);
    const { data: mcqData } = useSelector((state: RootState) => state.questions as any);
    const [opened, { open, close }] = useDisclosure(false);

    const form = useForm({
        initialValues: {
            title: '',
            description: '',
            shuffleQuestions: true,
            shuffleOptions: false,
            timeLimit: 0,
            
            // Filter mode
            subject: '',
            topic: '',
            difficulty: '',
            limit: 10,
            
            // Manual mode
            questionIds: [] as string[]
        },
        validate: {
            title: (val) => (val.trim().length < 3 ? 'Title must be at least 3 characters' : null),
            limit: (val) => (activeTab === 'filters' && val < 1 ? 'Limit must be at least 1' : null),
            questionIds: (val) => (activeTab === 'manual' && val.length === 0 ? 'Select at least one question' : null),
            description: () => null
        },
        validateInputOnChange: true
    });

    const handleSubmit = (values: typeof form.values) => {
        const payload: any = {
            title: values.title,
            description: values.description,
            settings: {
                shuffleQuestions: values.shuffleQuestions,
                shuffleOptions: values.shuffleOptions,
                timeLimit: values.timeLimit > 0 ? values.timeLimit : null
            }
        };

        if (activeTab === 'filters') {
            payload.filters = {
                limit: values.limit
            };
            if (values.subject) payload.filters.subject = values.subject;
            if (values.topic) payload.filters.topic = values.topic;
            if (values.difficulty) payload.filters.difficulty = values.difficulty;
        } else {
            payload.questionIds = values.questionIds;
        }

        dispatch(createQuiz(payload)).then((res: any) => {
            if (!res.error) {
                navigate('/quiz');
            }
        });
    };

    // Prepare manual selection options from loaded questions
    const questionOptions = (mcqData || []).map((q: any) => ({
        value: q._id,
        label: q.question.replace(/<[^>]+>/g, '').substring(0, 100) + '...' // Strip HTML for dropdown
    }));

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-bright-sun-400">Create New Quiz</h1>
            
            <Paper className="bg-mine-shaft-900 p-6" radius="md">
                <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <TextInput
                            label="Quiz Title"
                            placeholder="e.g., Weekly Math Review"
                            withAsterisk
                            {...form.getInputProps('title')}
                        />
                        <Textarea
                            label="Description"
                            placeholder="Optional description"
                            {...form.getInputProps('description')}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-mine-shaft-700 rounded-md">
                            <Switch
                                label="Shuffle Questions"
                                color="green"
                                {...form.getInputProps('shuffleQuestions', { type: 'checkbox' })}
                            />
                            <Switch
                                label="Shuffle Options"
                                color="green"
                                {...form.getInputProps('shuffleOptions', { type: 'checkbox' })}
                            />
                            <NumberInput
                                label="Time Limit (minutes)"
                                description="0 = no limit"
                                min={0}
                                {...form.getInputProps('timeLimit')}
                            />
                        </div>
                    </div>

                    <Tabs value={activeTab} onChange={setActiveTab} color="green">
                        <Tabs.List>
                            <Tabs.Tab value="filters">Auto-pick via Filters</Tabs.Tab>
                            <Tabs.Tab value="manual">Pick Specific Questions</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="filters" pt="xl">
                            <div className="space-y-4">
                                <SubjectTopicDropdown
                                    onChange={(subject: any, topic: any) =>
                                        form.setValues({ subject, topic })
                                    }
                                    subjectError={null}
                                    topicError={null}
                                    openSubjectForm={open}
                                />
                                <TextInput
                                    label="Difficulty"
                                    placeholder="easy, medium, or hard"
                                    {...form.getInputProps('difficulty')}
                                />
                                <NumberInput
                                    label="Number of Questions"
                                    min={1}
                                    max={100}
                                    {...form.getInputProps('limit')}
                                />
                            </div>
                        </Tabs.Panel>

                        <Tabs.Panel value="manual" pt="xl">
                            <MultiSelect
                                label="Select Questions"
                                placeholder="Search and select questions"
                                data={questionOptions}
                                searchable
                                clearable
                                limit={20}
                                {...form.getInputProps('questionIds')}
                            />
                            <p className="text-sm text-dimmed mt-2">
                                Note: Only questions currently loaded in memory will appear here. Navigate to the Questions tab first to load more.
                            </p>
                        </Tabs.Panel>
                    </Tabs>

                    <Group justify="flex-end" mt="xl">
                        <Button variant="subtle" color="gray" onClick={() => navigate('/quiz')}>Cancel</Button>
                        <Button type="submit" color="green" loading={loadingAction}>Create Quiz</Button>
                    </Group>
                </form>
            </Paper>

            <AddSubject opened={opened} close={close} />
        </div>
    );
};

export default CreateQuiz;
