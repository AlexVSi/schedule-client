import { IAcademicSubject, IScheduleConflict, ITimeSlot } from "@app/types/types";
import { ContextState } from "main";

export async function checkScheduleConflicts(assigment: IAcademicSubject, timeSlot: ITimeSlot, context: ContextState): Promise<IScheduleConflict[]> {
    const conflicts: IScheduleConflict[] = [];

    const allTimeSlotPurposes = await context.purposeSubjectStore.fetchByTimeSlot(timeSlot.id)

    if (allTimeSlotPurposes) {
        for (let p of allTimeSlotPurposes) {
            const a = await context.academicSubjectStore.fetchById(p.subjectId)
            const t = context.teacherStore.teachers.find(t => t.id === a?.teacherId)
            if (a?.teacherId === assigment?.teacherId) {
                conflicts.push({
                    academicSubjectId: assigment.id,
                    type: 'TEACHER',
                    message: `Преподаватель ${t?.lastname} ${t?.firstname[0]}.${t?.surname[0]}. уже занят в это время`,
                    existingEvent: p,
                });
                break
            }
        }
    }

    if (allTimeSlotPurposes) {
        const academicSubjectClassrooms = await context.classroomStore.fetchByAcademicSubject(assigment.id)
        const len = academicSubjectClassrooms?.length
        let counter = 0
        for (let p of allTimeSlotPurposes) {
            academicSubjectClassrooms?.map((academicSubjectClassroom => {
                if (academicSubjectClassroom.id === p.classroomId) {
                    counter += 1
                }
            }))
        }
        if (len === counter) {
            conflicts.push({
                academicSubjectId: assigment.id,
                type: 'CLASSROOM',
                message: `Аудитории уже заняты в это время`,
            })
        }
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