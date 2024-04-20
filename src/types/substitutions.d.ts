type Substitution = {
  lesson: string;
  teacher: string;
  branch: string;
  subject: string;
  class: string;
  case: string;
  message: string;
};

type SubstitutionTable = {
  time: string;
  dayIndex: number;
  zastepstwa: Substitution[];
};

type SubstitutionsPage = {
  timeRange: string;
  tables: SubstitutionTable[];
};
