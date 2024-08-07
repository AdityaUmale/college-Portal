import React from 'react';

// This would typically come from an API call or props
const sampleData = {
  'information-technology': {
    3: [
      { title: 'Data Structures', pdfLink: '/pdfs/it/sem3/data-structures.pdf' },
      { title: 'Object Oriented Programming', pdfLink: '/pdfs/it/sem3/oop.pdf' },
      { title: 'Database Management Systems', pdfLink: '/pdfs/it/sem3/dbms.pdf' },
    ],
    4: [
      { title: 'Computer Networks', pdfLink: '/pdfs/it/sem4/computer-networks.pdf' },
      { title: 'Operating Systems', pdfLink: '/pdfs/it/sem4/os.pdf' },
    ],
  },
  cse: {
    3: [
      { title: 'Data Structures', pdfLink: '/pdfs/cse/sem3/data-structures.pdf' },
      { title: 'Digital Logic', pdfLink: '/pdfs/cse/sem3/digital-logic.pdf' },
    ],
  },
  // ... other departments
};

interface PYQsProps {
  params: { department: string };
}

const normalizeDepartmentName = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, '-');
};

export default function PYQs({ params }: PYQsProps) {
  const { department } = params;
  const normalizedDepartment = normalizeDepartmentName(department);

  // Find the matching department data
  const departmentData = Object.entries(sampleData).find(
    ([key]) => normalizeDepartmentName(key) === normalizedDepartment
  )?.[1] || {};

  const departmentDisplayName = department.replace(/-/g, ' ').toUpperCase();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{departmentDisplayName} Previous Year Question Papers</h1>
      
      {Object.keys(departmentData).length === 0 ? (
        <p>No data available for this department.</p>
      ) : (
        Object.entries(departmentData).map(([semester, subjects]) => (
          <div key={semester} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Semester {semester}</h2>
            {Array.isArray(subjects) && subjects.length > 0 ? (
              <ul className="list-disc pl-6">
                {subjects.map((subject, index) => (
                  <li key={index} className="mb-2">
                    <a 
                      href={subject.pdfLink} 
                      className="text-blue-600 hover:underline"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {subject.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No subjects available for this semester.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}