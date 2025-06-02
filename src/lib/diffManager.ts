import { TableLesson } from "@majusss/timetable-parser";

export type DiffField = keyof LessonChange;

export interface LessonChange {
  subject?: DiffValue;
  groupName?: DiffValue;
  teacher?: DiffValue;
  room?: DiffValue;
}

export interface DiffValue {
  oldValue?: string;
  newValue?: string;
  kind?: string;
}

export interface TimetableDiffsProp {
  lessons: Partial<LessonChange>[][][];
}

export class DiffManager {
  constructor(
    private lesson: TableLesson,
    private diff?: Partial<LessonChange>,
  ) {}

  getValue(field: DiffField): string | undefined {
    if (!this.diff) {
      return this.lesson[field];
    }

    const diffValue = this.diff[field] as DiffValue;
    
    return this.getValueForOldReliable(field, diffValue);
  }

  getOldValue(field: DiffField): string | undefined {
    if (!this.diff) {
      return undefined;
    }

    const diffValue = this.diff[field] as DiffValue | undefined;

    
    return diffValue?.oldValue ?? this.lesson[field];
  }

  private getValueForOldReliable(field: DiffField, diffValue?: DiffValue): string | undefined {
    if (!diffValue?.oldValue) {
      return this.lesson[field];
    }
    return this.lesson[field];
  }
}

export class TeacherNameFormatter {
  static formatName(name?: string, shouldReverse: boolean = false): string | undefined {
    if (!name) return undefined;
    return shouldReverse ? name.split(" ").reverse().join(" ") : name;
  }
}