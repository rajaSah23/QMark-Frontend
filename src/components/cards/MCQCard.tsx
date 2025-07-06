import {
    Card,
    Text,
    Badge,
    Group,
    ActionIcon,
    Loader,
} from '@mantine/core';
import {
    IconBookmark,
    IconBookmarkFilled,
    IconTrash,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { deleteQuestion } from '../../store/action/question-action';

// Option component
const Option = ({
    option,
    color,
    onClick,
}: {
    option: string;
    color: string;
    onClick: () => void;
}) => {
    return (
        <Text
            className={`rounded ${color} w-full cursor-pointer`}
            p={10}
            onClick={onClick}
        >
            {option}
        </Text>
    );
};

// Main McqCard component
export default function McqCard({ qId, question, onToggleSave }: any) {
    interface AnswerState {
        index: number | null;
        isCorrect: boolean | null;
    }

    const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<AnswerState>({
        index: null,
        isCorrect: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);

    const dispatch = useDispatch<AppDispatch>();

    // Shuffle options on question load
    useEffect(() => {
        if (question?.options) {
            const shuffled = [...question.options].sort(() => Math.random() - 0.5);
            setShuffledOptions(shuffled);
            setSelectedOption({ index: null, isCorrect: null });
        }
    }, [question]);

    // Selection handler
    const handleOptionClick = (option: string, index: number) => {
        if (selectedOption.index === index) {
            // Deselect
            setSelectedOption({ index: null, isCorrect: null });
        } else {
            const isCorrect = option === question?.correctAnswer;
            setSelectedOption({ index, isCorrect });
        }
    };

    // Determine color for each option
    const getOptionColor = (index: number) => {
        if (index !== selectedOption.index) return 'bg-mine-shaft-900';
        return selectedOption.isCorrect
            ? 'bg-green-400/20 border-l-4 border-green-400'
            : 'bg-red-400/20 border-l-4 border-red-400';
    };

    // Delete handler
    const handleDeleteMCQ = async () => {
        setIsDeleting(true);
        dispatch(deleteQuestion(question?._id))
            .then(() => {
                // Optional callback
            })
            .finally(() => setIsDeleting(false));
    };

    return (
        <Card className="bg-mine-shaft-800 text-white shadow-lg border border-mine-shaft-800">
            {/* Header */}
            <Group justify="space-between">
                <Group justify="end">
                    <p className="font-bold">Question No: {qId}</p>
                </Group>
                <Group justify="end">
                    <Badge color="blue" className="text-sm">
                        {question?.subject?.subject}
                    </Badge>

                    {/* Save toggle (optional) */}
                    <ActionIcon
                        variant="transparent"
                        onClick={onToggleSave}
                        className="text-bright-sun-400 hover:text-bright-sun-300"
                    >
                        {false ? <IconBookmarkFilled /> : <IconBookmark />}
                    </ActionIcon>

                    {/* Difficulty Badge */}
                    <Badge
                        color={
                            question?.difficulty === 'hard'
                                ? 'red'
                                : question?.difficulty === 'medium'
                                    ? 'yellow'
                                    : 'green'
                        }
                    >
                        {question?.difficulty}
                    </Badge>

                    {/* Delete Button or Loader */}
                    {isDeleting ? (
                        <Loader size={22} />
                    ) : (
                        <ActionIcon
                            variant="transparent"
                            onClick={handleDeleteMCQ}
                            className="text-bright-sun-400 hover:text-bright-sun-300"
                        >
                            <IconTrash />
                        </ActionIcon>
                    )}
                </Group>
            </Group>

            {/* Question text */}
            <Text className="mt-4 text-lg font-medium">
                <div dangerouslySetInnerHTML={{ __html: question?.question }} />
            </Text>

            {/* Options */}
            <div className="mt-4 flex flex-col gap-2 w-full">
                {shuffledOptions.map((option, index) => (
                    <Option
                        key={index}
                        option={option}
                        color={getOptionColor(index)}
                        onClick={() => handleOptionClick(option, index)}
                    />
                ))}
            </div>

            {/* Explanation (only if correct) */}
            {selectedOption.index !== null && selectedOption.isCorrect && (
                <div className="my-4">
                    <div className="font-bold text-bright-sun-400">Explanation</div>
                    {/* <div>{question?.explanation}</div> */}
                    <div dangerouslySetInnerHTML={{ __html: question?.explanation }} />
                </div>
            )}
        </Card>
    );
}
