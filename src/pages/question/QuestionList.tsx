import { Grid, Loader, SegmentedControl } from '@mantine/core';
import McqCard from '../../components/cards/MCQCard';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { AppDispatch } from '../../store';
import ReusableModal from '../../components/modal/ReusableModal';
// import AddQuestion from './AddQuestion';
import { getQuestion } from '../../store/action/question-action';
import { useSearchParams } from 'react-router-dom';
// import { toast } from '../../../utils/APIClient';
import { useInView } from 'react-intersection-observer';
import { clearState } from '../../store/slice/QuestionSlice';

const QuestionList = () => {
    const dispatch = useDispatch<AppDispatch>();  // ✅ Typed dispatch
    const { data, loading, total, page, totalPages } = useSelector((state: any) => state.questions);
    const [searchParams, setSearchParams] = useSearchParams()
    const { ref, inView } = useInView();
    console.log("loading",loading);
    

    // console.log(searchParams.get("subject"));
    const difficulty = searchParams.get("difficulty") || "easy";
    // console.log(Object.fromEntries(searchParams.entries()));

    const url = window.location.pathname
    const isBookmarkPage = url.includes("bookmarks");


    if (isBookmarkPage) {
        searchParams.set("bookmark", "true");
    } else {
        searchParams.delete("bookmark")
    }



    useEffect(() => {
        dispatch(clearState());
        dispatch(getQuestion({...Object.fromEntries(searchParams.entries()),page:1}));
    }, [searchParams, url])
    console.log("Store:", data);

    useEffect(() => {
        if (inView && !loading && page < totalPages) {
            dispatch(getQuestion({...Object.fromEntries(searchParams.entries()),page:page+1}));
        }
      }, [inView]);

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

    // if (loading) return (
    //     <div className=' w-full h-[100vh] flex justify-center items-center'> <Loader /></div>
    // )

    return (
        <div className="space-y-6 p-0">

            <div className=' flex justify-between items-center'>
                {isBookmarkPage ? null : <ReusableModal title={getTitle()} />}
                {/* Total question and pages */}
                <div className='text-bright-sun-400 text-sm'>
                    Total : {total} | Pages: {page} out of {totalPages}
                </div>

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
                            // isSaved={true}
                            onToggleSave={() => { }}
                        />
                    </Grid.Col>
                ))}

                {/* If no data found */}
                {data?.length === 0 && !loading && (
                    <Grid.Col span={12} className='flex justify-center items-center'>
                        <div className='text-mine-shaft-400 text-lg'>No Questions Found</div>
                    </Grid.Col>
                )}
                {/* Loader & Observer div */}
                <Grid.Col span={12}  ref={ref} className='flex justify-center items-center'>
                    {loading  && <Loader />}
                </Grid.Col>
            </Grid>
        </div>
    );
}

export default QuestionList