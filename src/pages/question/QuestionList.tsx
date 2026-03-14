import { ActionIcon, Button, Grid, Loader, Menu, SegmentedControl, Tooltip } from '@mantine/core';
import McqCard from '../../components/cards/MCQCard';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { AppDispatch } from '../../store';
import ReusableModal from '../../components/modal/ReusableModal';
// import AddQuestion from './AddQuestion';
import { getQuestion } from '../../store/action/question-action';
import { useNavigate, useSearchParams } from 'react-router-dom';
// import { toast } from '../../../utils/APIClient';
import { useInView } from 'react-intersection-observer';
import { clearState } from '../../store/slice/QuestionSlice';
import SearchBox from '../../components/searchBox/SearchBox';
import { IconArrowsSort, IconCheck, IconFilter } from '@tabler/icons-react';
import { getSubjectList } from '../../store/action/master-action';

const QuestionList = () => {
    const dispatch = useDispatch<AppDispatch>();  // ✅ Typed dispatch
    const navigate = useNavigate();
    const { data, loading, total, page, totalPages } = useSelector((state: any) => state.questions);
    const { subjectList } = useSelector((state: any) => state.master);
    const [searchParams, setSearchParams] = useSearchParams()
    const { ref, inView } = useInView();
    console.log("loading", loading);


    const difficulty = searchParams.get("difficulty") || "easy";
    const sortBy = searchParams.get("sortBy") || "date";
    const sortDirection = searchParams.get("sortDirection") || "desc";
    const selectedSubject = searchParams.get("subject") || "all";

    const url = window.location.pathname
    const isBookmarkPage = url.includes("bookmarks");

    useEffect(() => {
        if (!subjectList || subjectList.length === 0) {
            dispatch(getSubjectList());
        }
    }, [dispatch, subjectList]);

    useEffect(() => {
        const nextParams = new URLSearchParams(searchParams.toString());
        let changed = false;

        if (isBookmarkPage) {
            if (nextParams.get("bookmark") !== "true") {
                nextParams.set("bookmark", "true");
                changed = true;
            }
        } else if (nextParams.has("bookmark")) {
            nextParams.delete("bookmark");
            changed = true;
        }

        if (!nextParams.get("sortBy")) {
            nextParams.set("sortBy", "date");
            changed = true;
        }

        if (!nextParams.get("sortDirection")) {
            nextParams.set("sortDirection", "desc");
            changed = true;
        }

        if (nextParams.get("sortBy") === "random" && !nextParams.get("randomSeed")) {
            nextParams.set("randomSeed", Date.now().toString());
            changed = true;
        }

        if (nextParams.get("sortBy") !== "random" && nextParams.has("randomSeed")) {
            nextParams.delete("randomSeed");
            changed = true;
        }

        if (changed) {
            setSearchParams(nextParams);
            return;
        }

        dispatch(clearState());
        dispatch(getQuestion({ ...Object.fromEntries(nextParams.entries()), page: 1 }));
    }, [dispatch, isBookmarkPage, searchParams, setSearchParams, url])
    console.log("Store:", data);

    useEffect(() => {
        if (inView && !loading && page < totalPages) {
            dispatch(getQuestion({ ...Object.fromEntries(searchParams.entries()), page: page + 1 }));
        }
    }, [dispatch, inView, loading, page, searchParams, totalPages]);

    const handleDifficultyChange = (val: any) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("difficulty", val);
        setSearchParams(newSearchParams);
    };

    const handleSortByChange = (val: string | null) => {
        if (!val) return;
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("sortBy", val);

        if (val === "random") {
            newSearchParams.set("sortDirection", "desc");
            newSearchParams.set("randomSeed", Date.now().toString());
        } else {
            newSearchParams.delete("randomSeed");
            if (!newSearchParams.get("sortDirection")) {
                newSearchParams.set("sortDirection", "desc");
            }
        }

        setSearchParams(newSearchParams);
    };

    const applySort = (nextSortBy: string, nextSortDirection: string) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("sortBy", nextSortBy);
        newSearchParams.set("sortDirection", nextSortDirection);

        if (nextSortBy === "random") {
            newSearchParams.set("randomSeed", Date.now().toString());
        } else {
            newSearchParams.delete("randomSeed");
        }

        setSearchParams(newSearchParams);
    };

    const currentSortLabel =
        sortBy === 'name'
            ? `Name ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`
            : sortBy === 'date'
                ? `Date ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`
                : 'Random order';

    const currentSubjectLabel =
        selectedSubject === 'all'
            ? 'All subjects'
            : subjectList?.find((subject: any) => subject._id === selectedSubject)?.subject || 'Subject';

    const applySubjectFilter = (subjectId: string) => {
        const newSearchParams = new URLSearchParams(searchParams);
        if (subjectId === 'all') {
            newSearchParams.delete('subject');
            newSearchParams.delete('topic');
        } else {
            newSearchParams.set('subject', subjectId);
            newSearchParams.delete('topic');
        }
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

            <div className=' flex justify-between items-center flex-wrap gap-3'>
                <div className=' flex justify-between items-center gap-3 flex-wrap'>
                    {isBookmarkPage ? null : <ReusableModal title={getTitle()} />}
                    <SearchBox />
                    {!isBookmarkPage && (
                        <Button variant="light" color="blue" onClick={() => navigate('/questions/analytics')}>
                            Question Analytics
                        </Button>
                    )}
                    <Menu shadow="md" width={220} position="bottom-start" withArrow>
                        <Menu.Target>
                            <Tooltip label={`Sort: ${currentSortLabel}`}>
                                <ActionIcon
                                    variant="light"
                                    color={sortBy === 'random' ? 'gray' : 'yellow'}
                                    size="lg"
                                    radius="xl"
                                    aria-label="Sort questions"
                                >
                                    <IconArrowsSort size={18} />
                                </ActionIcon>
                            </Tooltip>
                        </Menu.Target>

                        <Menu.Dropdown className="bg-mine-shaft-900 border border-mine-shaft-700 text-white">
                            <Menu.Label>Sort Questions</Menu.Label>
                            <Menu.Item
                                leftSection={sortBy === 'random' ? <IconCheck size={14} /> : undefined}
                                onClick={() => applySort('random', 'desc')}
                            >
                                Random order
                            </Menu.Item>
                            <Menu.Item
                                leftSection={sortBy === 'name' && sortDirection === 'asc' ? <IconCheck size={14} /> : undefined}
                                onClick={() => applySort('name', 'asc')}
                            >
                                Name ascending
                            </Menu.Item>
                            <Menu.Item
                                leftSection={sortBy === 'name' && sortDirection === 'desc' ? <IconCheck size={14} /> : undefined}
                                onClick={() => applySort('name', 'desc')}
                            >
                                Name descending
                            </Menu.Item>
                            <Menu.Item
                                leftSection={sortBy === 'date' && sortDirection === 'asc' ? <IconCheck size={14} /> : undefined}
                                onClick={() => applySort('date', 'asc')}
                            >
                                Date ascending
                            </Menu.Item>
                            <Menu.Item
                                leftSection={sortBy === 'date' && sortDirection === 'desc' ? <IconCheck size={14} /> : undefined}
                                onClick={() => applySort('date', 'desc')}
                            >
                                Date descending
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                    <Menu shadow="md" width={220} position="bottom-start" withArrow>
                        <Menu.Target>
                            <Tooltip label={`Subject: ${currentSubjectLabel}`}>
                                <ActionIcon
                                    variant="light"
                                    color={selectedSubject === 'all' ? 'gray' : 'yellow'}
                                    size="lg"
                                    radius="xl"
                                    aria-label="Filter by subject"
                                >
                                    <IconFilter size={18} />
                                </ActionIcon>
                            </Tooltip>
                        </Menu.Target>

                        <Menu.Dropdown className="bg-mine-shaft-900 border border-mine-shaft-700 text-white max-h-80 overflow-y-auto">
                            <Menu.Label>Filter by Subject</Menu.Label>
                            <Menu.Item
                                leftSection={selectedSubject === 'all' ? <IconCheck size={14} /> : undefined}
                                onClick={() => applySubjectFilter('all')}
                            >
                                All subjects
                            </Menu.Item>
                            {subjectList?.map((subject: any) => (
                                <Menu.Item
                                    key={subject._id}
                                    leftSection={selectedSubject === subject._id ? <IconCheck size={14} /> : undefined}
                                    onClick={() => applySubjectFilter(subject._id)}
                                >
                                    {subject.subject}
                                </Menu.Item>
                            ))}
                        </Menu.Dropdown>
                    </Menu>

                </div>
                <div className=' flex justify-between items-center gap-3 flex-wrap'>

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
                <Grid.Col span={12} ref={ref} className='flex justify-center items-center'>
                    {loading && <Loader />}
                </Grid.Col>
            </Grid>
        </div>
    );
}

export default QuestionList
