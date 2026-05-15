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
  name: '',
  nickname: '',
  stateOfOrigin: '',
  birthday: '',
  relationshipStatus: '',
  level: 'HND2_SWD',
  bestLevel: '',
  difficultLevel: '',
  bestCourse: '',
  worstCourse: '',
  favoriteLecturer: '',
  favoriteWord: '',
  hobby: '',
  businessSkill: '',
  classCrush: '',
  bestCampusExperience: '',
  photo: null,
  careerAlternative: '',
  postHeld: '',
  whatNext: '',
  socialHandle: '',
};

export const LEVEL_LABELS: Record<Level, string> = {
  ND2: 'ND2 - CS "DD Legends \'26"',
  HND2_SWD: 'HND2 - SWD "Class of Paragons 2026"',
  HND2_NCC: 'HND2 - NCC "Class of Cloud Pioneers 2026"',
};
