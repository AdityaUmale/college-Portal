// components/ClubMembersList.tsx
import React from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from '@/app/recoilContextProvider';

interface ClubMembersListProps {
  members: string[];
}

const ClubMembersList: React.FC<ClubMembersListProps> = ({ members }) => {
  const currentUser = useRecoilValue(userState);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Club Members</h3>
      <ul className="list-disc pl-5">
        {members.map((memberId, index) => (
          <li key={index} className={memberId === currentUser._id ? "font-bold" : ""}>
            {memberId === currentUser._id ? "You" : `Member ${index + 1}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClubMembersList;