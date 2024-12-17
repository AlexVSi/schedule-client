import { IAcademicSubject, IPurposeSubject, IScheduleConflict, ITimeSlot } from "@app/types/types";
import { Context } from "main";
import { useContext } from "react";

export function checkScheduleConflicts(assigment: IAcademicSubject, timeSlot: ITimeSlot): IScheduleConflict[] {
    const { timeSlotStore } = useContext(Context)
    const conflicts: IScheduleConflict[] = [];

    const allAssigments = timeSlotStore.fetchTimeSlot(timeSlot.id)

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


//   Конфликты:
//      Слот времени группы
//      Преподаватель
//      Аудитория (вместимость)
//      Переизбыток часов
//      Академический день/пара
//      Дистанционные предметы