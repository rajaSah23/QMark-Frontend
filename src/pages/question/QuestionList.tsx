import { Grid, Loader, SegmentedControl } from '@mantine/core';
import McqCard from '../../components/cards/MCQCard';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { AppDispatch } from '../../store';
import ReusableModal from '../../components/modal/ReusableModal';
import AddQuestion from './AddQuestion';
import { getQuestion } from '../../store/action/question-action';
import { useSearchParams } from 'react-router-dom';
import { toast } from '../../../utils/APIClient';

const QuestionList = () => {
    const dispatch = useDispatch<AppDispatch>();  // ✅ Typed dispatch
    const { data, loading } = useSelector((state: any) => state.questions);
    const [searchParams, setSearchParams] = useSearchParams()
    // console.log(searchParams.get("subject"));
    const difficulty = searchParams.get("difficulty") || "easy";
    // console.log(Object.fromEntries(searchParams.entries()));
    

    useEffect(() => {
        dispatch(getQuestion(Object.fromEntries(searchParams.entries())));
    }, [searchParams])
    console.log("Store:", data);

    const handleDifficultyChange = (val: any) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("difficulty", val);
        setSearchParams(newSearchParams);
    };

    const getTitle = () => {
        return <div className='text-bright-sun-400 text-xl font-bold'>
            Create Question
        </div>
    }

    if (loading) return (
        <div className=' w-full h-[100vh] flex justify-center items-center'> <Loader /></div>
    )

    return (
        <div className="space-y-6 p-10">
            
            <div className=' flex justify-between items-center'>
                <ReusableModal title={getTitle()}/>
                <SegmentedControl
                    size="xs"
                    radius="xl"
                    withItemsBorders={false}
                    color={difficulty === "easy" ? "green" : difficulty === "medium" ? "yellow" : "red"}
                    value={difficulty}
                    onChange={((val) => handleDifficultyChange(val))}
                    data={[
                        { label: 'Easy', value: 'easy' },
                        { label: 'Medium', value: 'medium' },
                        { label: 'Hard', value: 'hard' },
                    ]}
                />
            </div>
            {/* <h2 className="text-2xl font-bold text-bright-sun-400">Saved Questions</h2> */}
            <Grid >
                {data?.map((mcq: any, idx: any) => (
                    <Grid.Col key={idx} span={{ base: 12, md: 12, lg: 12 }} >
                        <McqCard
                            qId={idx + 1}
                            question={mcq}
                            isSaved={true}
                            onToggleSave={() => { }}
                        />
                    </Grid.Col>
                ))}
            </Grid>
        </div>
    );
}

export default QuestionList