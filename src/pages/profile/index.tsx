import { Button, Card, Modal, TextInput, Accordion, Badge, Group, ScrollArea, Skeleton, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AppDispatch } from "../../store";
import {
    createTopic, deleteSubject, deleteTopic, getSubjectList,
    getTopicList, updateSubject, updateTopic
} from "../../store/action/master-action";
import { updateProfile } from "../../store/action/user-action";
import { getPerformanceSummary } from "../../store/action/performance-action";
import {
    IconBorderLeftPlus, IconCheck, IconEdit, IconPlus, IconTrash, IconX,
    IconFlame, IconTargetArrow, IconClock, IconBook, IconPencil
} from "@tabler/icons-react";
import AddSubject from "../question/AddSubject";

// ─── Master Settings ────────────────────────────────────────────────────────
const MasterSettings = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { subjectList, topicList, loadingSubject, loadingSubjectAction, loadingTopic, loadingTopicAction } =
        useSelector((state: any) => state.master);
    const location = useLocation();

    const [expanded, setExpanded] = useState<string | null>(null);
    const [isModelOpen, setIsModelOpen] = useState(false);
    const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
    const [subjectEditText, setSubjectEditText] = useState('');
    const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
    const [topicEditText, setTopicEditText] = useState('');
    const [newTopicText, setNewTopicText] = useState('');
    const [addingTopicSubjectId, setAddingTopicSubjectId] = useState<string | null>(null);

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const el = document.getElementById(id);
            if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
        }
    }, [location]);

    useEffect(() => {
        if (!subjectList || subjectList.length === 0) dispatch(getSubjectList());
    }, [dispatch, subjectList]);

    const handleSubjectClick = (subjectId: string | null) => {
        setExpanded(prev => prev === subjectId ? null : subjectId);
        if (subjectId) dispatch(getTopicList(subjectId));
    };

    const handleSaveSubject = (subjectId: string) => {
        if (subjectEditText.trim()) {
            dispatch(updateSubject({ subjectId, subject: subjectEditText.trim() }));
            setEditingSubjectId(null);
        }
    };

    const handleSaveTopic = (topicId: string) => {
        if (topicEditText.trim()) {
            dispatch(updateTopic({ topicId, topic: topicEditText.trim() }));
            setEditingTopicId(null);
        }
    };

    const handleSaveNewTopic = (subjectId: string) => {
        if (newTopicText.trim()) {
            dispatch(createTopic({ subjectId, topic: newTopicText.trim() }));
            setAddingTopicSubjectId(null);
            setNewTopicText('');
        }
    };

    return (
        <div className="p-6">
            <Title className="flex justify-between items-center" order={3} mb={20}>
                Master Settings – Subjects
                <Button size="xs" variant="light" onClick={() => setIsModelOpen(true)}>
                    <IconBorderLeftPlus /> Add Subject
                </Button>
            </Title>

            <ScrollArea h={480}>
                {loadingSubject ? (
                    Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={60} mb="sm" radius="md" />)
                ) : subjectList?.length > 0 ? (
                    <Accordion variant="separated" multiple={false} value={expanded} onChange={handleSubjectClick}>
                        {subjectList.map((subject: any) => (
                            <Accordion.Item key={subject._id} value={subject._id}>
                                <Accordion.Control>
                                    <div className="flex justify-between w-full items-center">
                                        <div>
                                            {editingSubjectId === subject._id ? (
                                                <TextInput value={subjectEditText} onChange={e => setSubjectEditText(e.currentTarget.value)} size="xs" mb={4} />
                                            ) : (
                                                <Text fw={600}>{subject.subject}</Text>
                                            )}
                                            <Text size="xs" c="dimmed">Added {new Date(subject.createdAt).toLocaleDateString()}</Text>
                                        </div>
                                        <Group gap={4}>
                                            {editingSubjectId === subject._id ? (
                                                <>
                                                    <Button size="xs" variant="light" color="green" leftSection={<IconCheck size={14} />} onClick={() => handleSaveSubject(subject._id)} disabled={loadingSubjectAction}>Save</Button>
                                                    <Button size="xs" variant="light" color="gray" leftSection={<IconX size={14} />} onClick={() => setEditingSubjectId(null)}>Cancel</Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button size="xs" variant="light" onClick={() => { setEditingSubjectId(subject._id); setSubjectEditText(subject.subject); }} disabled={loadingSubjectAction}>Edit</Button>
                                                    <Button size="xs" color="red" variant="light" onClick={() => dispatch(deleteSubject(subject._id))} disabled={loadingSubjectAction}>Delete</Button>
                                                </>
                                            )}
                                        </Group>
                                    </div>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    {loadingTopic ? (
                                        Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} height={40} mb="xs" radius="sm" />)
                                    ) : (
                                        <>
                                            {topicList?.length > 0 ? topicList.map((topic: any) => (
                                                <Card key={topic._id} withBorder mb={8} p={6}>
                                                    <div className="flex justify-between items-center">
                                                        {editingTopicId === topic._id ? (
                                                            <TextInput value={topicEditText} onChange={e => setTopicEditText(e.currentTarget.value)} size="xs" />
                                                        ) : (
                                                            <Text size="sm" fw={500}>{topic.topic}</Text>
                                                        )}
                                                        <Group gap={4}>
                                                            {editingTopicId === topic._id ? (
                                                                <>
                                                                    <Button size="xs" variant="light" color="green" leftSection={<IconCheck size={14} />} onClick={() => handleSaveTopic(topic._id)} disabled={loadingTopicAction}>Save</Button>
                                                                    <Button size="xs" variant="light" color="gray" leftSection={<IconX size={14} />} onClick={() => setEditingTopicId(null)}>Cancel</Button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Button size="xs" variant="light" onClick={() => { setEditingTopicId(topic._id); setTopicEditText(topic.topic); }} disabled={loadingTopicAction}><IconEdit size={14} /></Button>
                                                                    <Button size="xs" color="red" variant="light" onClick={() => dispatch(deleteTopic(topic._id))} disabled={loadingTopicAction}><IconTrash size={14} /></Button>
                                                                </>
                                                            )}
                                                        </Group>
                                                    </div>
                                                </Card>
                                            )) : <Text size="sm" c="dimmed">No topics found.</Text>}

                                            {addingTopicSubjectId === subject._id ? (
                                                <div className="flex gap-2 mt-2">
                                                    <TextInput value={newTopicText} onChange={e => setNewTopicText(e.currentTarget.value)} size="xs" className="flex-1" placeholder="Topic name" />
                                                    <Button size="xs" variant="light" color="green" leftSection={<IconCheck size={14} />} onClick={() => handleSaveNewTopic(subject._id)} disabled={loadingTopicAction}>Save</Button>
                                                    <Button size="xs" variant="light" color="gray" leftSection={<IconX size={14} />} onClick={() => { setAddingTopicSubjectId(null); setNewTopicText(''); }}>Cancel</Button>
                                                </div>
                                            ) : (
                                                <Button mt="sm" size="xs" variant="light" leftSection={<IconPlus size={14} />} onClick={() => { setAddingTopicSubjectId(subject._id); setNewTopicText(''); }} disabled={loadingTopicAction}>Add Topic</Button>
                                            )}
                                        </>
                                    )}
                                </Accordion.Panel>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                ) : <Text c="dimmed">No subjects found.</Text>}
            </ScrollArea>

            <AddSubject opened={isModelOpen} close={() => setIsModelOpen(false)} />
        </div>
    );
};

// ─── Edit Profile Modal ───────────────────────────────────────────────────────
const EditProfileModal = ({ opened, onClose, currentName, currentEmail }: {
    opened: boolean; onClose: () => void; currentName: string; currentEmail: string;
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((store: any) => store.user);
    const [name, setName] = useState(currentName);
    const [email, setEmail] = useState(currentEmail);

    useEffect(() => { setName(currentName); setEmail(currentEmail); }, [currentName, currentEmail]);

    const handleSave = async () => {
        const result: any = await dispatch(updateProfile({ name: name.trim(), email: email.trim() }));
        if (!result.error) onClose();
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Edit Profile" centered size="sm">
            <div className="space-y-4">
                <TextInput label="Name" value={name} onChange={e => setName(e.currentTarget.value)} placeholder="Your name" />
                <TextInput label="Email" value={email} onChange={e => setEmail(e.currentTarget.value)} placeholder="your@email.com" type="email" />
                <Group justify="flex-end" mt="md">
                    <Button variant="subtle" color="gray" onClick={onClose}>Cancel</Button>
                    <Button color="yellow" loading={loading} onClick={handleSave} disabled={!name.trim()}>Save Changes</Button>
                </Group>
            </div>
        </Modal>
    );
};

// ─── Stat Badge ───────────────────────────────────────────────────────────────
const StatTile = ({ label, value, icon: Icon, color }: any) => (
    <div className="flex flex-col items-center p-4 bg-mine-shaft-800 rounded-lg border border-mine-shaft-700 gap-1">
        <Icon size={24} style={{ color }} />
        <Text size="xl" fw={700} style={{ color }}>{value ?? '—'}</Text>
        <Text size="xs" c="dimmed" ta="center">{label}</Text>
    </div>
);

// ─── Main ViewProfile ─────────────────────────────────────────────────────────
const ViewProfile = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { userData } = useSelector((store: any) => store.user);
    const { performanceSummary, streakRecord, loadingMeta } = useSelector((state: any) => state.performance);

    const [editOpen, setEditOpen] = useState(false);

    useEffect(() => {
        dispatch(getPerformanceSummary());
    }, [dispatch]);

    const handleLogOut = () => {
        localStorage.clear();
        window.dispatchEvent(new Event("local-storage"));
        navigate("/");
    };

    const initial = userData?.name?.charAt(0)?.toUpperCase() || '?';

    return (
        <div className="min-h-screen bg-mine-shaft-950 pt-20 pb-12 px-4">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Profile Header Card */}
                <Card className="bg-mine-shaft-900 border border-mine-shaft-700 p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-5">
                        <div className="w-20 h-20 bg-bright-sun-500 rounded-full flex items-center justify-center text-mine-shaft-900 text-3xl font-bold flex-shrink-0">
                            {initial}
                        </div>
                        <div className="flex-1 space-y-1">
                            <h1 className="text-2xl font-bold text-bright-sun-50">{userData?.name || 'User'}</h1>
                            <p className="text-mine-shaft-300 text-sm">{userData?.email}</p>
                            {userData?.role && (
                                <Badge color="yellow" variant="light">{userData.role}</Badge>
                            )}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                size="sm"
                                variant="light"
                                color="yellow"
                                leftSection={<IconEdit size={15} />}
                                onClick={() => setEditOpen(true)}
                            >
                                Edit Profile
                            </Button>
                            <Button size="sm" variant="outline" color="red" onClick={handleLogOut}>
                                Logout
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Performance Stats */}
                <Card className="bg-mine-shaft-900 border border-mine-shaft-700 p-6">
                    <Text size="lg" fw={700} className="text-bright-sun-400" mb="md">Your Stats</Text>
                    {loadingMeta ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={90} radius="md" />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatTile label="Questions Created" value={performanceSummary?.questionsCreated ?? 0} icon={IconPencil} color="#ffbd20" />
                            <StatTile label="Quizzes Completed" value={performanceSummary?.quizzesCompleted ?? 0} icon={IconTargetArrow} color="#40c057" />
                            <StatTile label="Accuracy Rate" value={`${performanceSummary?.accuracyRate ?? 0}%`} icon={IconBook} color="#4dabf7" />
                            <StatTile label="Time Spent" value={`${Math.round((performanceSummary?.timeSpentMinutes ?? 0) / 60)}h`} icon={IconClock} color="#da77f2" />
                        </div>
                    )}
                </Card>

                {/* Streak Info */}
                <Card className="bg-mine-shaft-900 border border-mine-shaft-700 p-6">
                    <Text size="lg" fw={700} className="text-bright-sun-400" mb="md">Streaks</Text>
                    {loadingMeta ? (
                        <Skeleton height={70} radius="md" />
                    ) : (
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-3 p-4 bg-orange-950 border border-orange-800 rounded-lg flex-1 min-w-[140px]">
                                <IconFlame size={32} className="text-orange-400" />
                                <div>
                                    <Text size="xs" c="orange.3">Current Streak</Text>
                                    <Text size="xl" fw={700} c="white">{streakRecord?.currentStreak || 0} days</Text>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-mine-shaft-800 border border-mine-shaft-700 rounded-lg flex-1 min-w-[140px]">
                                <IconFlame size={32} className="text-bright-sun-400" />
                                <div>
                                    <Text size="xs" c="dimmed">Longest Streak</Text>
                                    <Text size="xl" fw={700} className="text-bright-sun-400">{streakRecord?.longestStreak || 0} days</Text>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Quick Links */}
                <Card className="bg-mine-shaft-900 border border-mine-shaft-700 p-6">
                    <Text size="lg" fw={700} className="text-bright-sun-400" mb="md">Quick Navigation</Text>
                    <div className="flex flex-wrap gap-3">
                        <Link to="/questions"><Button variant="light" color="yellow" size="sm">My Questions</Button></Link>
                        <Link to="/questions/bookmarks"><Button variant="light" color="blue" size="sm">Bookmarks</Button></Link>
                        <Link to="/quiz"><Button variant="light" color="green" size="sm">My Quizzes</Button></Link>
                        <Link to="/dashboard/activity"><Button variant="light" color="orange" size="sm">Activity Dashboard</Button></Link>
                        <Link to="/dashboard/quiz-performance"><Button variant="light" color="grape" size="sm">Performance Dashboard</Button></Link>
                    </div>
                </Card>

                {/* Master Settings */}
                <Card className="bg-mine-shaft-900 border border-mine-shaft-700">
                    <section id="master-settings">
                        <MasterSettings />
                    </section>
                </Card>
            </div>

            {/* Edit Profile Modal */}
            <EditProfileModal
                opened={editOpen}
                onClose={() => setEditOpen(false)}
                currentName={userData?.name || ''}
                currentEmail={userData?.email || ''}
            />
        </div>
    );
};

export default ViewProfile;
