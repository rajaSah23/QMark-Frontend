import React, { useState, useEffect } from 'react';
import { Select } from '@mantine/core';

interface SubjectTopicDropdownProps {
  onChange: (subject: any, topic: any) => void;
  subjectError:any,
  topicError:any
}

const SubjectTopicDropdown: React.FC<SubjectTopicDropdownProps> = ({ onChange,subjectError,topicError }) => {
  const [subjectData, setSubjectData] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<any>('');
  const [selectedTopic, setSelectedTopic] = useState<any>('');

  // Simulate API call to fetch subjects and topics
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
      ];

      // Simulate API delay
      setTimeout(() => {
        setSubjectData(data);
      }, 500);
    };

    fetchSubjects();
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
  const topicOptions = currentSubject
    ? currentSubject.topics.map((topic: any) => ({
        value: topic.slug,
        label: topic.name,
      }))
    : [];

  // When either selection changes, trigger onChange callback
  const handleSubjectChange = (value: any) => {
    setSelectedSubject(value);
    setSelectedTopic(''); // Reset topic when subject changes
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
        data={subjectOptions}
        value={selectedSubject}
        onChange={handleSubjectChange}
        searchable
        error={subjectError}
      />
      <Select
        // mt="md"
        placeholder="Select a topic"
        data={topicOptions}
        value={selectedTopic}
        onChange={handleTopicChange}
        disabled={!selectedSubject}
        error={topicError}
      />
    </div>
  );
};

export default SubjectTopicDropdown;
