import { Badge, Card, Checkbox, Loader, Select, Text, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { getSubjectList, getTopicList } from "../../store/action/master-action";
import apiClient from "../../../utils/APIClient";

type ManualQuestionPickerProps = {
    value: string[];
    onChange: (value: string[]) => void;
};

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const ManualQuestionPicker = ({ value, onChange }: ManualQuestionPickerProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const { subjectList, topicList } = useSelector((state: RootState) => state.master as any);
    const { ref, inView } = useInView();

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [subject, setSubject] = useState<string | null>("");
    const [topic, setTopic] = useState<string | null>("");
    const [questions, setQuestions] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        dispatch(getSubjectList());
    }, [dispatch]);

    useEffect(() => {
        if (subject) {
            dispatch(getTopicList(subject));
        }
    }, [dispatch, subject]);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setSearch(searchInput.trim());
        }, 400);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [searchInput]);

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const response = await apiClient.GET("/mcq", {
                    page: 1,
                    limit: 12,
                    search,
                    subject: subject || undefined,
                    topic: topic || undefined
                });
                const payload = response.data?.data;
                setQuestions(payload?.results || []);
                setPage(payload?.page || 1);
                setTotalPages(payload?.totalPages || 1);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [search, subject, topic]);

    useEffect(() => {
        const fetchMore = async () => {
            if (!inView || loading || loadingMore || page >= totalPages) return;
            setLoadingMore(true);
            try {
                const nextPage = page + 1;
                const response = await apiClient.GET("/mcq", {
                    page: nextPage,
                    limit: 12,
                    search,
                    subject: subject || undefined,
                    topic: topic || undefined
                });
                const payload = response.data?.data;
                setQuestions((prev) => [...prev, ...(payload?.results || [])]);
                setPage(payload?.page || nextPage);
                setTotalPages(payload?.totalPages || totalPages);
            } finally {
                setLoadingMore(false);
            }
        };

        fetchMore();
    }, [inView, loading, loadingMore, page, totalPages, search, subject, topic]);

    const handleToggle = (questionId: string) => {
        if (value.includes(questionId)) {
            onChange(value.filter((item) => item !== questionId));
            return;
        }
        onChange([...value, questionId]);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <TextInput
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.currentTarget.value)}
                    placeholder="Search questions"
                    leftSection={<IconSearch size={16} />}
                />
                <Select
                    placeholder="Filter by subject"
                    data={(subjectList || []).map((item: any) => ({
                        value: item._id,
                        label: item.subject
                    }))}
                    value={subject}
                    onChange={(value) => {
                        setSubject(value || "");
                        setTopic("");
                    }}
                    searchable
                    clearable
                />
                <Select
                    placeholder="Filter by topic"
                    data={(topicList || []).map((item: any) => ({
                        value: item._id,
                        label: item.topic
                    }))}
                    value={topic}
                    onChange={(value) => setTopic(value || "")}
                    searchable
                    clearable
                    disabled={!subject}
                />
            </div>

            <div className="flex items-center justify-between">
                <Text size="sm" c="dimmed">Select questions from your question bank.</Text>
                <Badge color="green" variant="light">{value.length} selected</Badge>
            </div>

            <div className="space-y-3">
                {questions.map((question) => {
                    const checked = value.includes(question._id);
                    return (
                        <Card
                            key={question._id}
                            className={`border cursor-pointer transition-colors ${checked ? "border-green-500 bg-green-900/10" : "border-mine-shaft-700 bg-mine-shaft-900"}`}
                            onClick={() => handleToggle(question._id)}
                        >
                            <div className="flex items-start gap-3">
                                <Checkbox
                                    checked={checked}
                                    onChange={() => handleToggle(question._id)}
                                    mt={2}
                                    onClick={(event) => event.stopPropagation()}
                                />
                                <div className="flex-1 space-y-3">
                                    <div className="flex flex-wrap gap-2">
                                        {question?.subject?.subject && <Badge variant="light" color="blue">{question.subject.subject}</Badge>}
                                        {question?.topic?.topic && <Badge variant="light" color="grape">{question.topic.topic}</Badge>}
                                        <Badge variant="outline" color={question?.difficulty === "hard" ? "red" : question?.difficulty === "medium" ? "yellow" : "green"}>
                                            {question?.difficulty || "easy"}
                                        </Badge>
                                    </div>
                                    <Text fw={500}>{stripHtml(question.question || "").slice(0, 220)}</Text>
                                </div>
                            </div>
                        </Card>
                    );
                })}

                {!loading && questions.length === 0 && (
                    <Card className="bg-mine-shaft-900 border border-mine-shaft-700 text-center py-10">
                        <Text c="dimmed">No questions found for the selected filters.</Text>
                    </Card>
                )}

                <div ref={ref} className="flex justify-center py-2">
                    {(loading || loadingMore) && <Loader size="sm" />}
                </div>
            </div>
        </div>
    );
};

export default ManualQuestionPicker;
