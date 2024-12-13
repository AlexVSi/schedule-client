import { makeAutoObservable } from 'mobx';
import { IAcademicSubject, IClassroom, IClassroomType } from '@app/types/types';
import ClassroomService from '@entities/classroom/api/classroom.service';

export default class ClassroomStore {

    classrooms = [] as IClassroom[];
    classroomTypes = [] as IClassroomType[];

    constructor() {
        makeAutoObservable(this)
    }

    setClassrooms(classrooms: IClassroom[]) {
        this.classrooms = classrooms
    }

    setClassroomTypes(classroomTypes: IClassroomType[]) {
        this.classroomTypes = classroomTypes
    }

    async fetchAllClassrooms() {
        try {
            this.fetchAllClassroomTypes()
            const responce = await ClassroomService.getAll()
            this.setClassrooms(responce.data.rooms)
        } catch (e) {
            console.log(e)
        }
    }

    async fetchByAcademicSubject(id: IAcademicSubject['id']) {
        try {
            this.fetchAllClassroomTypes()
            const responce = await ClassroomService.getByAcademicSubject(id)
            return responce.data.rooms
        } catch (e) {
            console.log(e)
        }
    }

    async fetchAllClassroomTypes() {
        try {
            const responce = await ClassroomService.GetTypes()
            this.setClassroomTypes(responce.data.classrooms)
        } catch (e) {
            console.log(e)
        }
    }

    async add(body: Omit<IClassroom, 'id'>) {
        try {
            await ClassroomService.add(body)
            this.fetchAllClassrooms()
        } catch (e) {
            console.log(e);
        }
    }

    async edit(body: Partial<IClassroom>) {
        try {
            await ClassroomService.edit(body)
            this.fetchAllClassrooms()
        } catch (e) {
            console.log(e);
        }
    }

    async remove(id: IClassroom['id']) {
        try {
            await ClassroomService.remove(id)
            this.setClassrooms(this.classrooms.filter(c => c.id !== id))
        } catch (e) {
            console.log(e);
        }
    }

    async addSubject(classroomId: IClassroom['id'], academicSubjectId: IAcademicSubject['id']) {
        try {
            await ClassroomService.addSubject(classroomId, academicSubjectId)
        } catch (e) {
            console.log(e);
        }
    }

    async removeSubject(classroomId: IClassroom['id'], academicSubjectId: IAcademicSubject['id']) {
        try {
            await ClassroomService.removeSubject(classroomId, academicSubjectId)
        } catch (e) {
            console.log(e);
        }
    }
}
