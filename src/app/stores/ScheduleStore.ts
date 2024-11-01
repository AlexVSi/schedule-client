import { makeAutoObservable } from 'mobx';
import { format } from 'date-fns';
import { Teacher, Subject, Classroom, Group, ScheduleEvent, ScheduleConflict, CourseAssignment } from '../types/types';

class ScheduleStore {
  teachers: Teacher[] = [];
  subjects: Subject[] = [];
  classrooms: Classroom[] = [];
  groups: Group[] = [];
  courseAssignments: CourseAssignment[] = [];
  scheduleEvents: ScheduleEvent[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  // Teacher methods
  addTeacher(teacher: Omit<Teacher, 'id'>) {
    this.teachers.push({
      ...teacher,
      id: crypto.randomUUID(),
    });
  }

  updateTeacher(id: string, updates: Partial<Omit<Teacher, 'id'>>) {
    const index = this.teachers.findIndex(t => t.id === id);
    if (index !== -1) {
      this.teachers[index] = { ...this.teachers[index], ...updates };
    }
  }

  updateTeacherSubjects(teacherId: string, subjects: string[]) {
    const teacherIndex = this.teachers.findIndex(t => t.id === teacherId);
    if (teacherIndex !== -1) {
      this.teachers[teacherIndex] = {
        ...this.teachers[teacherIndex],
        subjects,
      };
    }
  }

  removeTeacher(id: string) {
    this.teachers = this.teachers.filter(teacher => teacher.id !== id);
    this.courseAssignments = this.courseAssignments.map(assignment => ({
      ...assignment,
      teacherIds: assignment.teacherIds.filter(tId => tId !== id),
    }));
  }

  // Subject methods
  addSubject(subject: Omit<Subject, 'id'>) {
    this.subjects.push({
      ...subject,
      id: crypto.randomUUID(),
    });
  }

  updateSubject(id: string, updates: Partial<Omit<Subject, 'id'>>) {
    const index = this.subjects.findIndex(s => s.id === id);
    if (index !== -1) {
      this.subjects[index] = { ...this.subjects[index], ...updates };
    }
  }

  removeSubject(id: string) {
    this.subjects = this.subjects.filter(subject => subject.id !== id);
    this.teachers = this.teachers.map(teacher => ({
      ...teacher,
      subjects: teacher.subjects.filter(sId => sId !== id),
    }));
    this.courseAssignments = this.courseAssignments.filter(
      assignment => assignment.subjectId !== id
    );
  }

  // Classroom methods
  addClassroom(classroom: Omit<Classroom, 'id'>) {
    this.classrooms.push({
      ...classroom,
      id: crypto.randomUUID(),
    });
  }

  updateClassroom(id: string, updates: Partial<Omit<Classroom, 'id'>>) {
    const index = this.classrooms.findIndex(c => c.id === id);
    if (index !== -1) {
      this.classrooms[index] = { ...this.classrooms[index], ...updates };
    }
  }

  removeClassroom(id: string) {
    this.classrooms = this.classrooms.filter(classroom => classroom.id !== id);
    this.courseAssignments = this.courseAssignments.map(assignment => ({
      ...assignment,
      classroomIds: assignment.classroomIds.filter(cId => cId !== id),
    }));
  }

  // Group methods
  addGroup(group: Omit<Group, 'id'>) {
    this.groups.push({
      ...group,
      id: crypto.randomUUID(),
    });
  }

  updateGroup(id: string, updates: Partial<Omit<Group, 'id'>>) {
    const index = this.groups.findIndex(g => g.id === id);
    if (index !== -1) {
      this.groups[index] = { ...this.groups[index], ...updates };
    }
  }

  removeGroup(id: string) {
    this.groups = this.groups.filter(group => group.id !== id);
    this.courseAssignments = this.courseAssignments.filter(assignment => assignment.groupId !== id);
    this.scheduleEvents = this.scheduleEvents.filter(event => event.groupId !== id);
  }

  // Course Assignment methods
  addCourseAssignment(assignment: Omit<CourseAssignment, 'id'>) {
    this.courseAssignments.push({
      ...assignment,
      id: crypto.randomUUID(),
    });
  }

  updateCourseAssignment(id: string, updates: Partial<Omit<CourseAssignment, 'id'>>) {
    const index = this.courseAssignments.findIndex(a => a.id === id);
    if (index !== -1) {
      this.courseAssignments[index] = { ...this.courseAssignments[index], ...updates };
    }
  }

  removeCourseAssignment(id: string) {
    this.courseAssignments = this.courseAssignments.filter(assignment => assignment.id !== id);
    this.scheduleEvents = this.scheduleEvents.filter(event => event.assignmentId !== id);
  }

  // Schedule Event methods
  addScheduleEvent(event: Omit<ScheduleEvent, 'id'>) {
    const conflicts = this.checkScheduleConflicts(event);
    if (conflicts.length > 0) {
      throw new Error(conflicts.map(c => c.message).join('\n'));
    }

    this.scheduleEvents.push({
      ...event,
      id: crypto.randomUUID(),
    });
  }

  updateScheduleEvent(id: string, updates: Partial<Omit<ScheduleEvent, 'id'>>) {
    const index = this.scheduleEvents.findIndex(e => e.id === id);
    if (index !== -1) {
      const updatedEvent = { ...this.scheduleEvents[index], ...updates };
      const conflicts = this.checkScheduleConflicts(updatedEvent);
      if (conflicts.length > 0) {
        throw new Error(conflicts.map(c => c.message).join('\n'));
      }
      this.scheduleEvents[index] = updatedEvent;
    }
  }

  removeScheduleEvent(id: string) {
    this.scheduleEvents = this.scheduleEvents.filter(event => event.id !== id);
  }

  // Helper methods
  getGroupAssignments(groupId: string): CourseAssignment[] {
    return this.courseAssignments.filter(assignment => assignment.groupId === groupId);
  }

  getTeachersBySubject(subjectId: string): Teacher[] {
    return this.teachers.filter(teacher => teacher.subjects.includes(subjectId));
  }

  getSubjectsByTeacher(teacherId: string): Subject[] {
    const teacher = this.teachers.find(t => t.id === teacherId);
    if (!teacher) return [];
    return this.subjects.filter(subject => teacher.subjects.includes(subject.id));
  }

  checkScheduleConflicts(event: Omit<ScheduleEvent, 'id'>): ScheduleConflict[] {
    const conflicts: ScheduleConflict[] = [];

    const conflictingEvents = this.scheduleEvents.filter(existingEvent => {
      const isTimeOverlap = (
        (event.startTime >= existingEvent.startTime && event.startTime < existingEvent.endTime) ||
        (event.endTime > existingEvent.startTime && event.endTime <= existingEvent.endTime) ||
        (event.startTime <= existingEvent.startTime && event.endTime >= existingEvent.endTime)
      );

      return isTimeOverlap;
    });

    const teacherConflict = conflictingEvents.find(e => e.teacherId === event.teacherId);
    if (teacherConflict) {
      const teacher = this.teachers.find(t => t.id === event.teacherId);
      conflicts.push({
        type: 'TEACHER',
        message: `Преподаватель ${teacher?.name} уже занят в это время`,
        existingEvent: teacherConflict,
      });
    }

    const classroomConflict = conflictingEvents.find(e => e.classroomId === event.classroomId);
    if (classroomConflict) {
      const classroom = this.classrooms.find(c => c.id === event.classroomId);
      conflicts.push({
        type: 'CLASSROOM',
        message: `Аудитория ${classroom?.number} уже занята в это время`,
        existingEvent: classroomConflict,
      });
    }

    return conflicts;
  }

  getGroupEvents(groupId: string): ScheduleEvent[] {
    return this.scheduleEvents.filter(event => event.groupId === groupId);
  }
}

export const scheduleStore = new ScheduleStore();