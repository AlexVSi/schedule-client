import { IAcademicSubject, IAccessPurposeType, IClassroom, ITimeSlot } from "@app/types/types";
import { ContextState } from "main";

export async function checkScheduleConflicts(assigment: IAcademicSubject, timeSlot: ITimeSlot, context: ContextState): Promise<IAccessPurposeType> {
    let purpose: IAccessPurposeType = {
        academicSubjectId: assigment.id,
        isAccess: true,
        classrooms: [],
        teacherId: assigment.id,
        accessTypes: ['full', 'even', 'odd'],
        isRemotely: false,
        hours: assigment.countHoursPerWeek,
        notAccsessReason: '',
    };
    const allTimeSlotPurposes = await context.purposeSubjectStore.fetchByTimeSlot(timeSlot.id)

    const busyTimes = await context.teacherStore.fetchBusyTimesByTeacher(assigment.teacherId)
    if (busyTimes) {
        for (let t of busyTimes) {
            if (timeSlot.dayOfWeek === t.dayOfWeek) {
                const flag = timeSlot.startTime <= t.startTime && timeSlot.endTime >= t.endTime ||
                    timeSlot.startTime >= t.startTime && timeSlot.endTime >= t.endTime ||
                    timeSlot.startTime >= t.startTime && timeSlot.endTime <= t.endTime
                if (flag) {
                    purpose.isAccess = false
                    purpose.isRemotely = true
                    purpose.notAccsessReason = `Преподаватель не может вести пары в это время`
                    return purpose
                }
            }
        }
    }

    if (allTimeSlotPurposes) {
        for (let p of allTimeSlotPurposes) {
            const a = await context.academicSubjectStore.fetchById(p.subjectId)
            if (a?.teacherId === assigment?.teacherId && !p.isRemotely) {
                if (p.type === 'full') {
                    const t = context.teacherStore.teachers.find(t => t.id === a?.teacherId)
                    purpose.isAccess = false
                    purpose.accessTypes = []
                    purpose.notAccsessReason = `Преподаватель ${t?.lastname} ${t?.firstname[0]}.${t?.surname[0]}. уже занят в это время`
                    return purpose
                } else {
                    purpose.accessTypes = purpose.accessTypes.filter(t => t !== 'full' && t !== p.type)
                }
                if (purpose.accessTypes.length === 0) {
                    const t = context.teacherStore.teachers.find(t => t.id === a?.teacherId)
                    purpose.isAccess = false
                    purpose.notAccsessReason = `Преподаватель ${t?.lastname} ${t?.firstname[0]}.${t?.surname[0]}. уже занят в это время`
                    return purpose
                }
            }
        }

        const academicSubjectClassrooms = await context.classroomStore.fetchByAcademicSubject(assigment.id) || []
        let accessiblClassrooms: IClassroom[] = academicSubjectClassrooms || []

        for (let i of academicSubjectClassrooms) {
            let capacity = i.capacity
            for (let j of allTimeSlotPurposes) {
                if (i.id === j.classroomId) {
                    capacity -= 1
                }
                if (capacity === 0) {
                    accessiblClassrooms = accessiblClassrooms.filter(c => c.id !== i.id)
                    break
                }
            }
        }
        if (accessiblClassrooms?.length === 0) {
            purpose.isAccess = false
            purpose.notAccsessReason = `Аудитории заняты`
            return purpose
        } else {
            purpose.classrooms = accessiblClassrooms
        }

        const allSubjectPurposes = await context.purposeSubjectStore.fetchByAcademicSubject(assigment.id)
        let hourCount = 0
        allSubjectPurposes?.map((p) => {
            if (p.type === 'full') {
                hourCount += 2
            } else {
                hourCount += 1
            }
        })

        if (hourCount === purpose.hours) {
            purpose.isAccess = false
            purpose.accessTypes = []
            purpose.notAccsessReason = 'Для данного предмета учтено необходимое количество часов'
            return purpose
        } else if (purpose.hours - hourCount === 1) {
            purpose.accessTypes = purpose.accessTypes.filter(t => t !== 'full')
        }
    }
    return purpose;
}
