import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const Sidebar = () => {
  const [searchParams] = useSearchParams()

  const subjectQuery = searchParams.get("subject") || "all";
  const topicQuery = searchParams.get("topic") || "other";
console.log(subjectQuery);

  // List of subjects with child topics
  const subjects = [
    {
      name: 'All',
      slug: 'all',
    },
    {
      name: 'Computer Network',
      slug: 'computer-network',
      children: [
        { name: 'OSI Model', slug: 'osi-model' },
        { name: 'TCP/IP', slug: 'tcp-ip' },
      ],
    },
    {
      name: 'DBMS',
      slug: 'dbms',
      children: [
        { name: 'SQL', slug: 'sql' },
        { name: 'NoSQL', slug: 'nosql' },
      ],
    },
    {
      name: 'Operating System',
      slug: 'operating-system',
      children: [
        { name: 'Process Management', slug: 'process-management' },
        { name: 'Memory Management', slug: 'memory-management' },
      ],
    },
    {
      name: 'Data Structures',
      slug: 'data-structures',
      children: [
        { name: 'Arrays', slug: 'arrays' },
        { name: 'Linked Lists', slug: 'linked-lists' },
      ],
    },
  ];

  // State to keep track of which subject is expanded
  const [expandedSubjects, setExpandedSubjects] = useState([]);

  const toggleSubject = (slug: any) => {
    setExpandedSubjects((prev: any) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  return (
    <aside className="w-64 h-full bg-mine-shaft-950 text-white p-4">
      <h2 className="text-xl font-semibold mb-4">Subjects</h2>
      <ul>
        {subjects?.map((subject: any) => (
          <li key={subject.slug} className={`mb-2  ${subject?.slug === subjectQuery && "bg-mine-shaft-800  rounded-sm"}`}>
            <div className={`flex items-center justify-between ${(subjectQuery==null || subject?.slug === subjectQuery )&& "text-bright-sun-400"}`}>
              {/* Subject Link */}
              <Link
                to={`?subject=${subject.slug}`}
                className="block px-2 py-1 rounded hover:bg-mine-shaft-800 transition-colors flex-1"
              >
                {subject.name}
              </Link>
              {/* Toggle Button for Child Topics */}
              {subject.children && subject.children.length > 0 && (
                <button
                  onClick={() => toggleSubject(subject.slug)}
                  className="p-1 focus:outline-none"
                >
                  <svg
                    className={`h-4 w-4 transform transition-transform duration-200 ${expandedSubjects[subject.slug] ? 'rotate-90' : ''
                      }`}
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
            {/* Render Child Topics if Expanded */}
            {expandedSubjects[subject.slug] && subject.children && (
              <ul className="ml-4 mt-1 ">
                {subject.children.map((child: any) => (
                  <li key={child.slug} className={`mb-1 ${child?.slug === topicQuery && "bg-mine-shaft-950 rounded-l-xl"}`}>
                    <Link
                      to={`?subject=${subject.slug}&topic=${child.slug}`}
                      className="block px-2 py-1 rounded transition-colors text-sm"
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
