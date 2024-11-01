export interface Teacher {
  id: string;
  name: string;
  // subjects?: Subject[];
  subjects: string[];
}

export interface Specialty {
  id: string;
  code: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  // teachers?: Teacher[];
  teachers: string[];
}

export interface Classroom {
  id: string;
  number: string;
  capacity: number;
}

export interface Group {
  id: string;
  name: string;
  studentsCount: number;
}

export interface CourseAssignment {
  id: string;
  groupId: string;
  subjectId: string;
  teacherIds: string[];
  classroomIds: string[];
  hoursPerWeek: number;
}

export interface ScheduleEvent {
  id: string;
  groupId: string;
  subjectId: string;
  assignmentId: string;
  teacherId: string;
  classroomId: string;
  startTime: Date;
  endTime: Date;
}

export type ConflictType = 'TEACHER' | 'CLASSROOM';

export interface ScheduleConflict {
  type: ConflictType;
  message: string;
  existingEvent: ScheduleEvent;
}
