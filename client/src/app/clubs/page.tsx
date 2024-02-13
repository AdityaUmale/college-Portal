"use client";

import ClubComponent from "@/components/ClubComponent";
import ListWrapper from "@/components/ListWrapper";
import { ClubForm } from "@/components/forms/ClubForm";
const clubs = [
  {
    name: "Club 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed viverra libero eget ipsum sodales, sed posuere odio rhoncus. Morbi dignissim, libero at dignissim ultrices, ipsum tortor cursus eros, eu luctus magna ante non ipsum. Fusce ut mi vel arcu sollicitudin elementum. Quisque non orci at velit hendrerit placerat. Nam suscipit nulla non ante dapibus, id vehicula felis feugiat. Aliquam erat volutpat.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed viverra libero eget ipsum sodales, sed posuere odio rhoncus. Morbi dignissim, libero at dignissim ultrices, ipsum tortor cursus eros, eu luctus magna ante non ipsum. Fusce ut mi vel arcu sollicitudin elementum. Quisque non orci at velit hendrerit placerat. Nam suscipit nulla non ante dapibus, id vehicula felis feugiat. Aliquam erat volutpat.",
    strength: 50,
    createdBy: "8",
    clubHead: "Alice Smith",
  },
  {
    name: "Club 2",
    description: "Description of Club 2",
    strength: 30,
    createdBy: "1",
    clubHead: "Bob Johnson",
  },
];
export default function Clubs() {
  return (
    <ListWrapper heading="Clubs" form={<ClubForm />}>
      {clubs.map((club, index) => (
        <ClubComponent
          key={index}
          name={club.name}
          description={club.description}
          createdBy={club.createdBy}
          strength={club.strength}
          clubHead={club.clubHead}
        />
      ))}
    </ListWrapper>
  );
}
