interface Substitution {
  lesson: string;
  teacher: string;
  branch: string;
  subject: string;
  class: string;
  case: string;
  message: string;
}

interface SubstitutionTable {
  time: string;
  dayIndex: number;
  zastepstwa: Substitution[];
}

interface SubstitutionsPage {
  heading: string;
  timeRange: string;
  tables: SubstitutionTable[];
}
