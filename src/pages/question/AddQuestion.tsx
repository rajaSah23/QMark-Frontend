import { useForm } from '@mantine/form';
import { TextInput, Button, Radio, SegmentedControl, TagsInput, Modal } from '@mantine/core';
import * as yup from 'yup';
import { yupResolver } from '@mantine/form';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { postQuestion } from '../../store/action/question-action';
import { AppDispatch } from '../../store';
import SubjectTopicDropdown from '../../components/dropdown';
import { toast } from '../../../utils/APIClient';
import TextEditor from '../../components/textEditor/TextEditor';
import { useDisclosure } from '@mantine/hooks';
import AddSubject from './AddSubject';
import { getSubjectList } from '../../store/action/master-action';

// Yup validation schema
const schema = yup.object().shape({
    question: yup
        .string()
        .trim()
        .required('Question is required')
        .min(5, 'Question must be at least 5 characters'),
    options: yup
        .array()
        .min(2, 'At least 2 options are required')
        .test('non-empty-options', 'All options must be filled', (options: any) =>
            options?.every((option: any) => option.trim() !== '')
        ),
    correctAnswer: yup
        .number()
        .required('Please select correct answer')
        .min(0, 'Please select correct answer'),
    explanation: yup
        .string()
        .optional(),
    subject: yup
        .string()
        .trim()
        .required('Please select subject'),
    topic: yup
        .string()
        .trim()
        .required('Please select topic'),
});

const AddQuestion = ({ setIsModelOpen }: any) => {
    const form = useForm({
        initialValues: {
            question: '',
            options: ['', ''],
            correctAnswer: -1,
            explanation: '',
            difficulty: 'easy',
            subject: "other",
            topic: "other",
            tag: [] as any[],
        },
        validate: yupResolver(schema),
        onValuesChange() {
            form.validate();
        },
    });

    const dispatch = useDispatch<AppDispatch>(); // Typed dispatch
    const [isSaving, setIsSaving] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);
    

    // useEffect(()=>{        
    //     dispatch(getSubjectList())
    // },[])

    const addOption = () => {
        if (form.values.options.length < 6) {
            form.insertListItem('options', '');
        }
    };

    const removeOption = (idx: number) => {
        if (form.values.options.length > 2) {
            form.removeListItem("options", idx);
            // Clear correct answer if removed option was selected
            if (form.values.correctAnswer === idx) {
                form.setFieldValue('correctAnswer', -1);
            }
        }
    };

    const handleQuestionSubmit = (data: any) => {
        console.log("handleQuestionSubmit", data);
        // Optionally open modal: setIsModelOpen(true);
        // Convert correct answer index to actual option text
        data.correctAnswer = data.options[data.correctAnswer];
        setIsSaving(true);
        dispatch(postQuestion(data))
            .then(() => {
                console.log("success", data);

                // Handle success
                setIsModelOpen(false);
            }).catch(() => {
                console.log("failed");

                toast.error("Question not saved", "Please try later");
            })
            .finally(() => {
                setIsSaving(false);
            });
    };

    console.log(form.errors);


    return (
        <>
            <form
                onSubmit={form.onSubmit(values => handleQuestionSubmit(values))}
                className="max-w-2xl mx-auto space-y-4"
            >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
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
                            { label: 'Easy', value: 'easy' },
                            { label: 'Medium', value: 'medium' },
                            { label: 'Hard', value: 'hard' },
                        ]}
                    />

                    {/* Integrated Subject & Topic Dropdown */}
                    <SubjectTopicDropdown
                        onChange={(subject: any, topic: any) =>
                            form.setValues({ subject, topic })
                        }
                        subjectError={form.errors?.subject}
                        topicError={form.errors?.topic}
                        openSubjectForm={() => open()}
                    />
                </div>



                <div className='flex justify-end items-center '>
                    <TagsInput
                        data={[]}
                        placeholder="tags(optional)"
                        value={form.getValues().tag}
                        onChange={(val: any) => {
                            if (val.length > 5) return;
                            form.setValues({ tag: val });
                        }}
                        className="w-fit"
                    />
                </div>

                {/* <Textarea
                placeholder="Write your question here..."
                label="Question"
                autosize
                minRows={3}
                {...form.getInputProps('question')}
                className="rounded-lg"
                error={form.errors.question}
            /> */}
                <p>Question</p>
                <TextEditor value={form.getValues().question} onChange={({ html, text }) => {
                    (text.trim() === "") ? form.setValues({ question: "" }) : form.setValues({ question: html })
                }} />
                <p className='text-red-500'>{form.errors?.question}</p>

                <div className="space-y-2">
                    <label className="block text-sm font-medium">Options</label>
                    {form.values.options?.map((option, index) => (
                        <div
                            key={index}
                            className={`p-2 rounded transition-colors ${form.values.correctAnswer === index
                                ? 'bg-green-400/15 border-l-4 border-green-400/80'
                                : 'bg-mine-shaft-950 hover:bg-mine-shaft-900'
                                }`}
                        >
                            <div className="flex gap-2 items-center">
                                <Radio
                                    value={index.toString()}
                                    checked={form.values.correctAnswer === index}
                                    onChange={() => form.setFieldValue('correctAnswer', index)}
                                    color="green"
                                    variant="outline"
                                    error={false}
                                />
                                <TextInput
                                    placeholder={`Option ${index + 1}`}
                                    value={option}
                                    {...form.getInputProps(`options.${index}`)}
                                    className="flex-1 font-semibold"
                                    autoComplete="off"
                                    variant="unstyled"
                                />
                                <span
                                    onClick={() => removeOption(index)}
                                    className="px-2 cursor-pointer bg-mine-shaft-800 rounded-full hover:text-red-400"
                                >
                                    X
                                </span>
                            </div>
                            {form.errors[`options.${index}`] && (
                                <div className="text-red-500 text-sm mt-1">
                                    {/* {form.errors[`options.${index}`]} */}
                                </div>
                            )}
                        </div>
                    ))}

                    {(form.errors.options || form.errors.correctAnswer) && (
                        <div className="text-red-500 text-sm">
                            {form.errors.options || form.errors.correctAnswer}
                        </div>
                    )}

                    <Button
                        type="button"
                        onClick={addOption}
                        variant="outline"
                        className="mt-2"
                        size="sm"
                        disabled={form.values.options.length >= 4}
                    >
                        Add Option
                    </Button>
                </div>

                {/* <Textarea
                placeholder="Write the explanation here...(optional)"
                label="Explanation"
                autosize
                minRows={3}
                {...form.getInputProps('explanation')}
                className="rounded-lg"
                error={form.errors.explanation}
            /> */}
                <p>Explanation</p>
                <TextEditor value={form.getValues().explanation} onChange={({ html }) => form.setValues({ explanation: html })} />

                <Button
                    type="submit"
                    color="green"
                    className="w-full mt-6"
                    size="md"
                    loading={isSaving}
                    disabled={isSaving}
                >
                    Submit Question
                </Button>
            </form>
            <AddSubject opened={opened} close={close} />
        </>

    );
};

export default AddQuestion;
