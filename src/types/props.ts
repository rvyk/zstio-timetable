type hourType = {
  number: number;
  timeFrom: string;
  timeTo: string;
};

type lessonType = {
  subject: string;
  room?: string;
  roomId?: string;
  groupName?: string;
  teacher?: string;
  teacherId?: string;
  className?: string;
  classId?: string;
};

type timeTableType = {
  hours: hourType[];
  generatedDate: string;
  title: string;
  validDate: string;
  lessons: lessonType[][][];
};

type nameValueType = {
  name: string;
  value: string;
};

type props = {
  status: boolean;
  timeTableID: string;
  timeTable: timeTableType;
  classes: nameValueType[];
  teachers: nameValueType[];
  rooms: nameValueType[];
  siteTitle: string;
  text: string;
  substitutions: substitutions;
};

type dropdownSearchType = {
  name: string;
  value: string;
};

interface SnowOption {
  snowflakeCount: number;
  speed: [number, number];
  wind: [number, number];
  radius: [number, number];
}
