export interface ISchedule {
  id: number;
  name: string;
  isPublic: string;
  timeOfStart: Date;
}

export interface ITeacher {
  id: number;
  lastname: string;
  firstname: string;
  surname: string;
  busyTimes: IBusyTime['id'][];
}

export interface IBusyTime {
  id: number;
  teacher: ITeacher['id'];
  daysOfWeek: Date;
  timeOfStart: Date;
  timeOfEnd: Date;
}

export interface ISpeciality {
  id: number;
  name: string;
}

export interface IGroup {
  id: number;
  name: string;
  specialityId: ISpeciality['id'];
}

export interface IClassroomType {
  id: number;
  name: string;
}

export interface IClassroom {
  id: number;
  name: string;
  capacity: number;
  type: IClassroomType['id'];
}

export interface ISubject {
  id: number;
  name: string;
  teachers: ITeacher['id'][];
  color: string;
}

export interface IAcademicSubject {
  id: number;
  name: ISubject['id'];
  countHoursPerWeek: number;
  groupId: IGroup['id'];
  schedulesId: ISchedule['id'];
  teacherId: ITeacher['id'];
  numberOfSubgroup: number;
}

enum TypeSubject {
  full = 0,
  even = 1,
  odd  = 2,
}

export interface IPurposeSubject {
  id: number;
  type: TypeSubject;
  isRemotely: boolean
  subjectId: IAcademicSubject['id'];
  classroomId: IClassroom['id']
  slotId: ITimeSlot['id'];
}

export interface ITimeSlot {
  id: number;
  schedulesId: ISchedule['id'];
  numberOfSubject: number
  dayOfWeek: number;
  startTime: Date;
  endTime: Date;
}

export type ConflictType = 'TEACHER' | 'CLASSROOM';

export interface IScheduleConflict {
  type: ConflictType;
  message: string;
  existingEvent: IPurposeSubject;
}
