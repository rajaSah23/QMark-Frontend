import React, { useState, useEffect } from 'react';
import { Select } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import { getSubjectList, getTopicList } from '../../store/action/master-action';

interface SubjectTopicDropdownProps {
  onChange: (subject: any, topic: any) => void;
  subjectError: any,
  topicError: any,
  openSubjectForm: () => void
}

const SubjectTopicDropdown: React.FC<SubjectTopicDropdownProps> = ({ onChange, subjectError, topicError, openSubjectForm }) => {
  const dispatch = useDispatch<AppDispatch>(); // Typed dispatch

  const { subjectList,topicList } = useSelector((state: any) => state.master);

  console.log("Master subjectList", subjectList);
  console.log("Master topicList", topicList);

  const [subjectData, setSubjectData] = useState<any[]>([]);
  const [topicData, setTopicData] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<any>('');
  const [selectedTopic, setSelectedTopic] = useState<any>('');

  // Simulate API call to fetch subjects and topics
  useEffect(() => {
    dispatch(getSubjectList())
  }, [])
  console.log("selectedSubject",selectedSubject);
  console.log("selectedTopics",selectedTopic);

  useEffect(() => {
   if(selectedSubject) dispatch(getTopicList(selectedSubject));
  }, [selectedSubject])

  useEffect(() => {
    let subjects = subjectList?.map((subject:any)=>{
      return {
        label: subject.subject,
        value: subject._id,
      }
    })
    // subjects.push({
    //   label: 'Other',
    //   value: 'other'
    // })
    subjects.push({
      label: '+ Add Subject',
      value: 'add-subject'
    })
    setSubjectData(subjects || [])
  }, [subjectList])

  useEffect(() => {
    const topics = topicList?.map((topic:any)=>{
      return {
        label: topic.topic,
        value: topic._id,
        slug: topic.slug
      }
    })
    console.log("topics",topics);
    setTopicData(topics || []);
  }, [topicList])


  useEffect(() => {
    const fetchSubjects = async () => {
      // Simulated API response
      const data: any[] = [
        {
          name: 'Computer Network',
          slug: 'computer-network',
          topics: [
            { name: 'OSI Model', slug: 'osi-model' },
            { name: 'TCP/IP', slug: 'tcp-ip' },
            { name: 'Other', slug: 'other' },
          ],
        },
        {
          name: 'DBMS',
          slug: 'dbms',
          topics: [
            { name: 'SQL', slug: 'sql' },
            { name: 'NoSQL', slug: 'nosql' },
            { name: 'Other', slug: 'other' },
          ],
        },
        {
          name: 'Operating System',
          slug: 'operating-system',
          topics: [
            { name: 'Process Management', slug: 'process-management' },
            { name: 'Memory Management', slug: 'memory-management' },
            { name: 'Other', slug: 'other' },
          ],
        },
        {
          name: 'Data Structures',
          slug: 'data-structures',
          topics: [
            { name: 'Arrays', slug: 'arrays' },
            { name: 'Linked Lists', slug: 'linked-lists' },
            { name: 'Other', slug: 'other' },
          ],
        },
        {
          name: 'Other',
          slug: 'other',
          topics: [
            { name: 'Other', slug: 'other' },
          ],
        },
        {
          name: '+ Add Subject',
          slug: 'add-subject',
          topics: [],
        },
      ];

      // Simulate API delay
      setTimeout(() => {
        setSubjectData(data);
      }, 500);
    };

    // fetchSubjects();
  }, []);

  // Map subject data to options for the Subject Select
  const subjectOptions = subjectData.map((subject: any) => ({
    value: subject.slug,
    label: subject.name,
  }));

  // Find the currently selected subject object
  const currentSubject: any = subjectData.find(
    (subject: any) => subject.slug === selectedSubject
  );

  // Map current subject topics to options for the Topic Select
  // const topicOptions = currentSubject
  //   ? currentSubject.topics.map((topic: any) => ({
  //     value: topic.slug,
  //     label: topic.name,
  //   }))
  //   : [];
  const topicOptions = topicList?.map((topic: any) => ({
      value: topic.slug,
      label: topic.topic,
    }))

  // When either selection changes, trigger onChange callback
  const handleSubjectChange = (value: any) => {
    console.log("handleSubjectChange",value);
    
    if (value === 'add-subject') {
      openSubjectForm();
      return
    }
    setSelectedTopic(''); // Reset topic when subject changes
    setSelectedSubject(value);
    onChange(value, ''); // update parent form state
  };

  const handleTopicChange = (value: any) => {
    setSelectedTopic(value);
    onChange(selectedSubject, value);
  };

  return (
    <div className='flex justify-center items-center gap-2 flex-wrap'>
      <Select
        placeholder="Select a subject"
        data={subjectData}
        value={selectedSubject}
        onChange={handleSubjectChange}
        searchable
        error={subjectError}
      />
      <Select
        // mt="md"
        placeholder="Select a topic"
        data={topicData||[]}
        value={selectedTopic||null}
        onChange={handleTopicChange}
        disabled={topicData?.length==0 || !selectedSubject}
        error={topicError}
      />
    </div>
  );
};

export default SubjectTopicDropdown;
