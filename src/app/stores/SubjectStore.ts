import { makeAutoObservable } from 'mobx';
import { ISubject, ITeacher } from '@app/types/types';
import subjectService from '@entities/subject/api/subject.service';

export default class SubjectStore {

    subjects = [] as ISubject[];

    constructor() {
        makeAutoObservable(this)
    }

    setSubjects(subjects: ISubject[]) {
        this.subjects = subjects
    }

    async fetchAllsubjects() {
        try {
            const responce = await subjectService.getAll()
            this.setSubjects(responce.data.names)
        } catch (e) {
            console.log(e)
        }
    }

    async fetchSubjectsByTeacher(id: ITeacher['id']) {
        try {
            const responce = await subjectService.getSubjectsByTeacher(id)
            return responce.data.names
        } catch (e) {
            console.log(e)
        }
    }

    async add(body: Omit<ISubject, 'id'>) {
        try {
            await subjectService.add(body)
            this.fetchAllsubjects()
        } catch (e) {
            console.log(e);
        }
    }

    async edit(body: Partial<ISubject>) {
        try {
            await subjectService.edit(body)
            this.fetchAllsubjects()
        } catch (e) {
            console.log(e);
        }
    }

    async remove(id: ISubject['id']) {
        try {
            await subjectService.remove(id)
            this.setSubjects(this.subjects.filter(s => s.id !== id))
        } catch (e) {
            console.log(e);
        }
    }
}
