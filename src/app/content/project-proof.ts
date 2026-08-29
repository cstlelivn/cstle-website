export type ProjectProofProfile = {
  title: string;
  status: 'Completed project' | 'In progress';
  summary: string;
  services: string[];
};

export const projectProofProfiles: Array<{ matches: RegExp; profile: ProjectProofProfile }> = [
  {
    matches: /(project[-_ ]?001|renovation project 001|trombley)/i,
    profile: {
      title: 'A Brighter Way to Live',
      status: 'Completed project',
      summary: 'Painting, doors, trim, flooring transitions and bathroom details come together in a clean, comfortable lower level.',
      services: ['Basement finishing', 'Painting', 'Flooring', 'Trim & doors', 'Bathrooms'],
    },
  },
  {
    matches: /(project[-_ ]?002|renovation project 002|lentil|daycare)/i,
    profile: {
      title: 'Ready for Busy Little Days',
      status: 'Completed project',
      summary: 'A practical space shaped for childcare, with durable surfaces, open circulation, a compact washroom and considered finishing details.',
      services: ['Basement finishing', 'Flooring', 'Trim & doors', 'Bathrooms', 'Installations'],
    },
  },
  {
    matches: /(project[-_ ]?003|renovation project 003|buckingham)/i,
    profile: {
      title: 'Connected From Room to Room',
      status: 'Completed project',
      summary: 'A compact suite brought together through consistent kitchen, bathroom, living, flooring, door and trim details.',
      services: ['Basement finishing', 'Kitchens', 'Bathrooms', 'Flooring', 'Trim & doors'],
    },
  },
  {
    matches: /(project[-_ ]?004|p004|greenstone 1)/i,
    profile: {
      title: 'Clean Lines, Room to Grow',
      status: 'Completed project',
      summary: 'Consistent flooring, door and closet trim, hallway alignment and stair details give this lower level a calm, connected finish.',
      services: ['Basement finishing', 'Flooring', 'Trim & doors', 'Painting'],
    },
  },
  {
    matches: /(project[-_ ]?005|p005|greenstone 2)/i,
    profile: {
      title: 'From Unfinished to Refined',
      status: 'Completed project',
      summary: 'A basement transformation documented from early construction through flooring, trim and stair installation to the finished space.',
      services: ['Basement finishing', 'Flooring', 'Trim & doors', 'Painting'],
    },
  },
  {
    matches: /(project[-_ ]?009|p009|stapleford)/i,
    profile: {
      title: 'Every Detail Brought Together',
      status: 'Completed project',
      summary: 'Drywall, flooring, painting, stair work and kitchenette installation combine in a functional Saskatchewan lower level.',
      services: ['Basement finishing', 'Flooring', 'Painting', 'Trim & doors', 'Installations'],
    },
  },
];
