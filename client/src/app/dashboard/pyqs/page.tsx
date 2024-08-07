import React from 'react';
import Link from 'next/link';

function Pyqs() {
  const departments = [
    "Computer Science and Engineering",
    "Chemical Engineering",
    "Civil Engineering",
    "Mechanical Engineering",
    "Information Technology",
    "First Year"
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Departments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-6xl">
        {departments.map((dept, index) => (
          <Link href={`/dashboard/pyqs/${encodeURIComponent(dept.toLowerCase().replace(/ /g, '-'))}`} key={index}>
            <div className="p-6 bg-white rounded-lg shadow-md text-center cursor-pointer hover:bg-gray-50">
              {dept}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Pyqs;