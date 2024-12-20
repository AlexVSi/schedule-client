import { makeAutoObservable } from 'mobx';
import { IBusyTime, ISubject, ITeacher } from '@app/types/types';
import TeacherService from '@entities/teacher/api/teacher.service';

export default class TeacherStore {

    teachers = [] as ITeacher[];

    constructor() {
        makeAutoObservable(this)
    }

    setTeachers(teachers: ITeacher[]) {
        this.teachers = teachers
    }

    addTeacher(teaher: ITeacher) {
        this.teachers = [...this.teachers, teaher]
    }

    async fetchAllTeachers() {
        try {
            const responce = await TeacherService.getAll()
            this.setTeachers(responce.data.teachers)
        } catch (e) {
            console.log(e)
        }
    }

    async fetchTeacher(id: ITeacher['id']) {
        try {
            const responce = await TeacherService.get(id)
            return responce.data.teacher
        } catch (e) {
            console.log(e)
        }
    }

    async fetchTeachersBySubject(id: ISubject['id']) {
        try {
            const responce = await TeacherService.getTeachersBySubject(id)
            if (responce.data.teachers) {
                return responce.data.teachers
            }
        } catch (e) {
            console.log(e)
        }
    }

    async add(body: Omit<ITeacher, 'id'>) {
        try {
            const response = await TeacherService.add(body)
            await this.fetchTeachersBySubject(response.data.id)
            this.addTeacher({...body, id: response.data.id})
            return response.data.id
        } catch (e) {
            console.log(e);
        }
    }

    async addSubject(teacherId: ITeacher['id'], subjectsId:ISubject['id']) {
        try {
            await TeacherService.addSubject(teacherId, subjectsId)
            await this.fetchAllTeachers()
        } catch (e) {
            console.log(e);
        }
    }

    async removeSubject(teacherId: ITeacher['id'], subjectsId:ISubject['id']) {
        try {
            await TeacherService.removeSubject(teacherId, subjectsId)
            await this.fetchAllTeachers()
        } catch (e) {
            console.log(e);
        }
    }

    async edit(body: Partial<ITeacher>) {
        try {
            await TeacherService.edit(body)
            await this.fetchAllTeachers()
        } catch (e) {
            console.log(e);
        }
    }

    async remove(id: ITeacher['id']) {
        try {
            await TeacherService.remove(id)
            this.setTeachers(this.teachers.filter(t => t.id !== id))
        } catch (e) {
            console.log(e);
        }
    }

    async fetchBusyTime() {
        try {

        } catch (e) {
            console.log(e);
        }
    }

    async fetchBusyTimesByTeacher(id: ITeacher['id']) {
        try {
            const responce = await TeacherService.getBusyTimesByTeacher(id)
            return responce.data.times
        } catch (e) {
            console.log(e);
        }
    }

    async addBusyTime(body: Omit<IBusyTime, 'id'>) {
        try {
            const responce = await TeacherService.addBusyTime(body)
            return responce.data.id
        } catch (e) {
            console.log(e);
        }
    }

    async editBusyTime() {
        try {
        
        } catch (e) {
            console.log(e);
        }
    }

    async removeBusyTime(id: IBusyTime['id']) {
        try {
            await TeacherService.removeBusyTime(id)
        } catch (e) {
            console.log(e);
        }
    }
}
