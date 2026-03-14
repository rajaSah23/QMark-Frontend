import React, { useState } from 'react';
import { useForm } from '@mantine/form';
import { TextInput, Textarea, Button, Switch, NumberInput, Paper, Tabs, Group, SegmentedControl, Text, Select } from '@mantine/core';
import SubjectTopicDropdown from '../../components/dropdown';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { createQuiz } from '../../store/action/quiz-action';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import AddSubject from '../question/AddSubject';
import ManualQuestionPicker from './ManualQuestionPicker';
import { getSubjectList } from '../../store/action/master-action';

type CreateQuizFormValues = {
  title: string;
  description: string;
  quizSubject: string;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  timeLimit: number;

  subject: string;
  topic: string;
  difficulty: string;
  limit: number;

  questionIds: string[];
};

const CreateQuiz = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string | null>('filters');
    const { loadingAction } = useSelector((state: RootState) => state.quiz as any);
    const { subjectList } = useSelector((state: RootState) => state.master as any);
    const [opened, { open, close }] = useDisclosure(false);

    React.useEffect(() => {
        if (!subjectList || subjectList.length === 0) {
            dispatch(getSubjectList(undefined as any));
        }
    }, [dispatch, subjectList]);

    const form = useForm<CreateQuizFormValues>({
        initialValues: {
            title: '',
            description: '',
            quizSubject: '',
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
            subject: values.quizSubject || null,
            settings: {
                shuffleQuestions: values.shuffleQuestions,
                shuffleOptions: values.shuffleOptions,
                timeLimit: values.timeLimit > 0 ? values.timeLimit : 0
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
                        <Select
                            label="Quiz Subject Category"
                            placeholder="No subject category"
                            data={[
                                { label: 'No subject category', value: '' },
                                ...(subjectList?.map((subject: any) => ({
                                    label: subject.subject,
                                    value: subject._id
                                })) || [])
                            ]}
                            {...form.getInputProps('quizSubject')}
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
                                {/* <TextInput
                                    label="Difficulty"
                                    placeholder="easy, medium, or hard"
                                    {...form.getInputProps('difficulty')}
                                /> */}
                                <label className="text-sm font-medium text-gray-400">Difficulty</label>
                                <SegmentedControl
                                    size="xs"
                                    radius="xl"
                                    withItemsBorders={false}
                                    color={
                                        form.getValues().difficulty === "easy"
                                            ? "green"
                                            : form.getValues().difficulty === "medium"
                                                ? "yellow"
                                                : "red"
                                    }
                                    value={form.getValues().difficulty}
                                    onChange={(val) => form.setValues({ difficulty: val })}
                                    data={[
                                        { label: 'All', value: '' },
                                        { label: 'Easy', value: 'easy' },
                                        { label: 'Medium', value: 'medium' },
                                        { label: 'Hard', value: 'hard' },
                                    ]}
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
                            <ManualQuestionPicker
                                value={form.values.questionIds}
                                onChange={(questionIds) => form.setFieldValue('questionIds', questionIds)}
                            />
                            {form.errors.questionIds && (
                                <Text c="red" size="sm" mt="sm">{form.errors.questionIds}</Text>
                            )}
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
