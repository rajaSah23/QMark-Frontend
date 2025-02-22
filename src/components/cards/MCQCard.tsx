import { Card, Text, Badge, Group, ActionIcon, Loader } from '@mantine/core';
import { IconBookmark, IconBookmarkFilled, IconTrash } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { deleteQuestion } from '../../store/action/question-action';

export default function McqCard({ qId,question, onToggleSave }: any) {
    interface AnswerState {
        index: number | null;
        isCorrect: boolean | null;
    }

    const [shuffledOptions, setShuffledOptions] = useState<any[]>([]);



    const [selectedOption, setSelectedOption] = useState<AnswerState>({
        index: null,
        isCorrect: null,
    });
    const [isDeleting, setIsDeleting] = useState(false);




    const dispatch = useDispatch<AppDispatch>();  // ✅ Typed dispatch

    useEffect(() => {
        if (question?.options) {
            setShuffledOptions([...question.options].map(option => option).sort(() => Math.random() - 0.5));
        }
    }, [question]);

    const onAnsCheck = (ans: any, idx: any) => {
        question?.correctAnswer === ans;
        const result = {
            index: idx,
            isCorrect: question?.correctAnswer === ans
        }
        setSelectedOption(result);
    }

    const optionColor = (idx: any) => {
        if (idx != selectedOption.index) return "bg-mine-shaft-900";
        else if (idx == selectedOption.index && selectedOption.isCorrect) return "bg-green-400/20 border-l-4 border-green-400"
        else return "bg-red-400/20 border-l-4 border-red-400"
    }

    const handleDeleteMCQ = async () => {
        setIsDeleting(true)
        dispatch(deleteQuestion(question?._id)).then(() => {

        }).finally(() => {
            setIsDeleting(false)
        })
    }

    return (
        <Card className=" bg-mine-shaft-800 text-white shadow-lg border border-mine-shaft-800">
            <Group justify='space-between'>
                <Group justify="end"  >
                    <p className=' font-bold'>Question No : {qId}</p>
                </Group>
                <Group justify="end"  >
                    <ActionIcon
                        variant="transparent"
                        onClick={onToggleSave}
                        className="text-bright-sun-400 hover:text-bright-sun-300"
                    >
                        {false ? <IconBookmarkFilled /> : <IconBookmark />}
                    </ActionIcon>
                    <Badge color={question?.difficulty === 'hard' ? 'red' : question?.difficulty === 'medium' ? "yellow" : 'green'}>
                        {question?.difficulty}
                    </Badge>



                    {isDeleting ? <Loader size={22} /> :
                        <ActionIcon
                            variant="transparent"
                            onClick={handleDeleteMCQ}
                            className="text-bright-sun-400 hover:text-bright-sun-300"
                        >
                            {<IconTrash />}
                        </ActionIcon>
                    }



                </Group>
            </Group>

            <Text className="mt-4 text-lg font-medium"><div dangerouslySetInnerHTML={{ __html: question?.question }} />
            </Text>

            <div className="mt-4 flex flex-col gap-2 w-full">
                {shuffledOptions?.map((option: any, index: any) => (
                    <Text
                        key={index}
                        className={` rounded ${optionColor(index)} w-full`}

                        p={10}
                        onClick={() => onAnsCheck(option, index)}
                    >
                        {option}
                    </Text>
                ))}
            </div>
            {
                selectedOption.isCorrect && <div className='my-4  '>
                    <div className=' font-bold text-bright-sun-400 '>Explanation</div>
                    {question?.explanation}
                </div>
            }
        </Card>
    );
}