import { Accordion, Badge, Button, Card, Group, ScrollArea, Skeleton, Text, TextInput, Title } from "@mantine/core";
import { getUserData } from "../../../utils/Utility";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../store";
import { deleteSubject, deleteTopic, getSubjectList, getTopicList, updateSubject, updateTopic } from "../../store/action/master-action";
import { IconBorderLeftPlus, IconCheck, IconEdit, IconTrash, IconX } from "@tabler/icons-react";
import AddSubject from "../question/AddSubject";


const MasterSettings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    subjectList,
    topicList,
    loadingSubject,
    loadingSubjectAction,
    loadingTopic,
    loadingTopicAction,
  } = useSelector((state: any) => state.master);

  const location = useLocation();

  const [expanded, setExpanded] = useState<string | null>(null);
  const [isModelOpen, setIsModelOpen] = useState(false);

  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [subjectEditText, setSubjectEditText] = useState('');

  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [topicEditText, setTopicEditText] = useState('');

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 0);
      }
    }
  }, [location]);

  useEffect(() => {
    if (!subjectList || subjectList.length === 0) {
      dispatch(getSubjectList());
    }
  }, [dispatch, subjectList]);

  const handleSubjectClick = (subjectId: string | null) => {
    setExpanded((prev) => (prev === subjectId ? null : subjectId));
    if (subjectId) dispatch(getTopicList(subjectId));
  };

  const handleDeleteSubject = (subjectId: string) => {
    dispatch(deleteSubject(subjectId));
  };

  const handleDeleteTopic = (topicId: string) => {
    dispatch(deleteTopic(topicId));
  };

  const handleEditSubject = (subject: any) => {
    setEditingSubjectId(subject._id);
    setSubjectEditText(subject.subject);
  };

  const handleSaveSubject = (subjectId: string) => {
    if (subjectEditText.trim()) {
      dispatch(updateSubject({ subjectId, subject: subjectEditText.trim() }));
      setEditingSubjectId(null);
    }
  };

  const handleEditTopic = (topic: any) => {
    setEditingTopicId(topic._id);
    setTopicEditText(topic.topic);
  };

  const handleSaveTopic = (topicId: string) => {
    if (topicEditText.trim()) {
      dispatch(updateTopic({ topicId, topic: topicEditText.trim() }));
      setEditingTopicId(null);
    }
  };

  const renderSubjectSkeletons = () => (
    Array.from({ length: 3 }).map((_, index) => (
      <Skeleton key={index} height={70} mb="sm" radius="md" />
    ))
  );

  const renderTopicSkeletons = () => (
    Array.from({ length: 2 }).map((_, index) => (
      <Skeleton key={index} height={45} mb="xs" radius="sm" />
    ))
  );

  return (
    <div className="p-6">
      <Title className="flex justify-between items-center" order={3} mb={20}>
        Master Settings – Subject List
        <Button size="xs" variant="light" onClick={() => setIsModelOpen(true)}>
          <IconBorderLeftPlus /> Add Subject
        </Button>
      </Title>

      <ScrollArea h={500}>
        {loadingSubject ? (
          <div>{renderSubjectSkeletons()}</div>
        ) : subjectList?.length > 0 ? (
          <Accordion
            variant="separated"
            multiple={false}
            value={expanded}
            onChange={(value) => {
              handleSubjectClick(value);
            }}
          >
            {subjectList.map((subject: any) => (
              <Accordion.Item key={subject._id} value={subject._id}>
                <Accordion.Control>
                  <div className="flex justify-between w-full items-center">
                    <div>
                      {editingSubjectId === subject._id ? (
                        <TextInput
                          value={subjectEditText}
                          onChange={(e) => setSubjectEditText(e.currentTarget.value)}
                          size="xs"
                          className="mb-1"
                        />
                      ) : (
                        <Text fw={600}>{subject.subject}</Text>
                      )}
                      <Text size="xs" c="dimmed">
                        Created At: {new Date(subject.createdAt).toLocaleDateString()}
                      </Text>
                    </div>
                    <Group gap={4}>
                      {editingSubjectId === subject._id ? (
                        <>
                          <Button
                            size="xs"
                            variant="light"
                            color="green"
                            leftSection={<IconCheck size={14} />}
                            onClick={() => handleSaveSubject(subject._id)}
                            disabled={loadingSubjectAction}
                          >
                            Save
                          </Button>
                          <Button
                            size="xs"
                            variant="light"
                            color="gray"
                            leftSection={<IconX size={14} />}
                            onClick={() => setEditingSubjectId(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="xs"
                            variant="light"
                            onClick={() => handleEditSubject(subject)}
                            disabled={loadingSubjectAction}
                          >
                            Edit
                          </Button>
                          <Button
                            size="xs"
                            color="red"
                            variant="light"
                            onClick={() => handleDeleteSubject(subject._id)}
                            disabled={loadingSubjectAction}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </Group>
                  </div>
                </Accordion.Control>
                <Accordion.Panel>
                  {loadingTopic ? (
                    renderTopicSkeletons()
                  ) : topicList?.length > 0 ? (
                    topicList.map((topic: any) => (
                      <Card key={topic._id} withBorder mb={8} p={6}>
                        <div className="flex justify-between items-center">
                          {editingTopicId === topic._id ? (
                            <TextInput
                              value={topicEditText}
                              onChange={(e) => setTopicEditText(e.currentTarget.value)}
                              size="xs"
                            />
                          ) : (
                            <Text size="sm" fw={500}>
                              {topic.topic}
                            </Text>
                          )}
                          <Group gap={4}>
                            {editingTopicId === topic._id ? (
                              <>
                                <Button
                                  size="xs"
                                  variant="light"
                                  color="green"
                                  leftSection={<IconCheck size={14} />}
                                  onClick={() => handleSaveTopic(topic._id)}
                                  disabled={loadingTopicAction}
                                >
                                  Save
                                </Button>
                                <Button
                                  size="xs"
                                  variant="light"
                                  color="gray"
                                  leftSection={<IconX size={14} />}
                                  onClick={() => setEditingTopicId(null)}
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="xs"
                                  variant="light"
                                  onClick={() => handleEditTopic(topic)}
                                  disabled={loadingTopicAction}
                                >
                                  <IconEdit size={14} />
                                </Button>
                                <Button
                                  size="xs"
                                  color="red"
                                  variant="light"
                                  onClick={() => handleDeleteTopic(topic._id)}
                                  disabled={loadingTopicAction}
                                >
                                  <IconTrash size={14} />
                                </Button>
                              </>
                            )}
                          </Group>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <Text size="sm" c="dimmed">
                      No topics found.
                    </Text>
                  )}
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        ) : (
          <Text>No subjects found.</Text>
        )}
      </ScrollArea>

      <AddSubject opened={isModelOpen} close={() => setIsModelOpen(false)} />
    </div>
  );
};



const ViewProfile = () => {
  // const userdata = getUserData();
  const navigate = useNavigate()

  const { userData, loading } = useSelector((store: any) => store.user)

  const handleLogOut = () => {
    localStorage.clear();

    // ✅ Dispatch custom event so the same-tab component updates
    window.dispatchEvent(new Event("local-storage")); // trigger same-tab update
    navigate("/")

  };

  return (
    <div className="min-h-screen bg-mine-shaft-950 p-6">
      <div className="mx-auto rounded-md p-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center md:flex-row md:items-center">
          <div className="w-24 h-24 bg-bright-sun-500 rounded-full flex items-center justify-center text-mine-shaft-900 text-3xl font-bold hover:cursor-pointer">
            {userData?.name?.toString().toUpperCase()?.charAt(0)}
          </div>
          <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
            <h1 className="text-2xl font-bold text-bright-sun-50">{userData?.name}</h1>
            <p className="text-mine-shaft-300">{userData?.email}</p>
          </div>
        </div>

        <Button onClick={() => handleLogOut()}>LogOut</Button>

        {/* About Me Section */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-bright-sun-50">About Me</h2>
          <p className="mt-2 text-mine-shaft-300">
            I'm currently preparing for competitive exams like SSC and UPSC. I use this platform daily to practice and collect tricky MCQs that help sharpen my concepts and revision strategy.
          </p>
        </div>

        {/* Saved MCQs Section */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-bright-sun-50">Saved Questions</h2>
          <div className="mt-4 space-y-4">
            <div className="p-4 bg-mine-shaft-800 rounded-md shadow hover:cursor-pointer hover:bg-mine-shaft-700">
              <h3 className="text-lg font-semibold text-bright-sun-50">
                Which layer of the OSI model is responsible for routing?
              </h3>
              <p className="text-sm text-mine-shaft-400">Saved under: Computer Networks</p>
            </div>
            <div className="p-4 bg-mine-shaft-800 rounded-md shadow hover:cursor-pointer hover:bg-mine-shaft-700">
              <h3 className="text-lg font-semibold text-bright-sun-50">
                What is the Big-O time complexity of binary search?
              </h3>
              <p className="text-sm text-mine-shaft-400">Saved under: Algorithms</p>
            </div>
          </div>
        </div>

        {/* Activity Summary */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-bright-sun-50">Daily Activity Summary</h2>
          <ul className="mt-4 space-y-2 text-mine-shaft-300 list-disc list-inside">
            <li>
              <span className="text-bright-sun-400 font-semibold">MCQs Practiced:</span> 102 today
            </li>
            <li>
              <span className="text-bright-sun-400 font-semibold">MCQs Saved:</span> 4 tricky ones
            </li>
            <li>
              <span className="text-bright-sun-400 font-semibold">Subjects Covered:</span> Polity, Reasoning
            </li>
          </ul>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 bg-bright-sun-500 text-mine-shaft-900 font-semibold rounded-md hover:bg-bright-sun-400 hover:cursor-pointer transition">
            Edit Profile
          </button>
        </div>
      </div>
      <section id="master-settings">

        <MasterSettings />
      </section>
    </div>
  );
};

export default ViewProfile;
