export interface ISchedule {
  id: number;
  name: string;
  isPublic: boolean;
  timeOfStart: Date;
}

export interface ITeacher {
  id: number;
  lastname: string;
  firstname: string;
  surname: string;
}

export interface IBusyTime {
  id: number;
  teacherId: ITeacher['id'];
  dayOfWeek: number;
  startTime: Date;
  endTime: Date;
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

export type TypeSubject = 'full' | 'even' | 'odd';

export interface IPurposeSubject {
  id: number;
  type: TypeSubject;
  isRemotely: boolean;
  subjectId: IAcademicSubject['id'];
  classroomId?: IClassroom['id'];
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

export interface ISlotTemplateName {
  name: string;
  display: string;
}

export interface IAccessPurposeType {
  academicSubjectId: IAcademicSubject['id'];
  isAccess: boolean;
  classrooms: IClassroom[];
  teacherId: ITeacher['id'];
  accessTypes: TypeSubject[];
  isRemotely: boolean;
  hours: number;
  notAccsessReason?: string;
}