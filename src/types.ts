export type Level = 'ND2' | 'HND2_SWD' | 'HND2_NCC';

export interface StudentData {
  name: string;
  nickname: string;
  stateOfOrigin: string;
  birthday: string;
  relationshipStatus: string;
  level: Level;
  bestLevel: string;
  difficultLevel: string;
  bestCourse: string;
  worstCourse: string;
  favoriteLecturer: string;
  favoriteWord: string;
  hobby: string;
  businessSkill: string;
  classCrush: string;
  bestCampusExperience: string;
  photo: string | null;
  careerAlternative: string;
  postHeld: string;
  whatNext: string;
  socialHandle: string;
}

export const INITIAL_DATA: StudentData = {
  name: 'Lawal Olamide',
  nickname: 'Lammy',
  stateOfOrigin: 'Lagos State',
  birthday: 'August 24th',
  relationshipStatus: 'Single',
  level: 'HND2_SWD',
  bestLevel: 'HND 1',
  difficultLevel: 'HND 2',
  bestCourse: 'Mobile App Development',
  worstCourse: 'Operation Research',
  favoriteLecturer: 'Mr. Adesina',
  favoriteWord: 'Trust the process',
  hobby: 'Reading & Coding',
  businessSkill: 'Graphics Design',
  classCrush: 'Hidden',
  bestCampusExperience: 'NACOS Dinner Night',
  photo: null,
  careerAlternative: 'Product Designer',
  postHeld: 'Welfare Director',
  whatNext: 'MSc in Computer Science',
  socialHandle: '@lammy_codes',
};

export const LEVEL_LABELS: Record<Level, string> = {
  ND2: 'ND2',
  HND2_SWD: 'HND2 - SWD "Class of Paragons 2026"',
  HND2_NCC: 'HND2 - NCC "Class of Cloud Pioneers 2026"',
};
