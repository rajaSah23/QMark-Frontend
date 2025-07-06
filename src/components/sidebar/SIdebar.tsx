import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { getSubjectList, getTopicList } from '../../store/action/master-action';
import { AppDispatch } from '../../store';
import { IconEdit } from '@tabler/icons-react';

const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { subjectList, topicList } = useSelector((state: any) => state.master);

  const [searchParams] = useSearchParams();
  const subjectQuery = searchParams.get('subject') || 'all';
  const topicQuery = searchParams.get('topic') || '';

  const [expandedSubjects, setExpandedSubjects] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    dispatch(getSubjectList());
  }, [dispatch]);

  useEffect(() => {
    if (subjectQuery && subjectQuery !== 'all') {
      dispatch(getTopicList(subjectQuery));
    }
  }, [dispatch, subjectQuery]);

  const toggleSubject = (subjectId: string) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [subjectId]: !prev[subjectId],
    }));
  };

  return (
    <aside className="w-64 h-full bg-mine-shaft-950 text-white p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4 flex gap-1 items-center">Subjects <span className='cursor-pointer' onClick={()=>navigate("/profile#master-settings")}><IconEdit/></span></h2>
      <ul>
        {subjectList?.map((subject: any) => {
          const isExpanded = expandedSubjects[subject._id] || false;
          const isSelected = subject._id === subjectQuery;

          return (
            <li key={subject._id} className={`mb-2 ${isSelected ? 'bg-mine-shaft-800 rounded-sm' : ''}`}>
              <div className="flex items-center justify-between">
                <Link
                  to={`?subject=${subject._id}`}
                  className={`block px-2 py-1 rounded flex-1 transition-colors ${isSelected ? 'text-bright-sun-400' : 'hover:bg-mine-shaft-800'}`}
                >
                  {subject.subject}
                </Link>

                {/* Show toggle button if subject is selected and topicList is available */}
                {isSelected && topicList?.length > 0 && (
                  <button
                    onClick={() => toggleSubject(subject._id)}
                    className="p-1 focus:outline-none"
                  >
                    <svg
                      className={`h-4 w-4 transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Show topic list if subject is expanded and selected */}
              {isExpanded && isSelected && topicList?.length > 0 && (
                <ul className="ml-4 mt-1">
                  {topicList.map((topic: any) => (
                    <li
                      key={topic._id}
                      className={`mb-1 ${topic._id === topicQuery ? 'bg-mine-shaft-950 rounded-l-xl' : ''}`}
                    >
                      <Link
                        to={`?subject=${subject._id}&topic=${topic._id}`}
                        className="block px-2 py-1 text-sm transition-colors"
                      >
                        {topic.topic}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
