type Substitution = {
  lesson: string;
  teacher: string;
  branch: string;
  subject: string;
  class: string;
  case: string;
  message: string;
};

type SubstitutionTables = {
  time: string;
  dayIndex: number;
  zastepstwa: Substitution[];
};

type Substitutions = {
  status: boolean;
  timeRange: string;
  tables: SubstitutionTables[];
};
