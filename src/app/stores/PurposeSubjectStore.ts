import { makeAutoObservable } from 'mobx';
import { IAcademicSubject, IPurposeSubject } from '@app/types/types';
import PurposeSubjectService from '@entities/purposeSubject/api/PurposeSubject.service';

export default class PurposeSubjectStore {

    purposeSubjects = [] as IPurposeSubject[];
    groupPurposeSubjects = [] as IPurposeSubject[];

    constructor() {
        makeAutoObservable(this)
    }

    setPurposeSubjects(purposeSubjects: IPurposeSubject[]) {
        this.purposeSubjects = purposeSubjects
    }

    setGroupPurposeSubjects(groupPurposeSubjects: IPurposeSubject[]) {
        this.groupPurposeSubjects = groupPurposeSubjects
    }

    async fetchByAcademicSubject(id: IAcademicSubject['id']) {
        try {
            const responce = await PurposeSubjectService.getByAcademicSubject(id)
            this.setPurposeSubjects(responce.data.purposes)
            return responce.data.purposes
        } catch (e) {
            console.log(e)
        }
    }

    async add(body: Omit<IPurposeSubject, 'id'>) {
        try {
            const responce = await PurposeSubjectService.add(body)
            this.fetchByAcademicSubject(responce.data.id)
            this.groupPurposeSubjects.push({...body, id: responce.data.id})
        } catch (e) {
            console.log(e);
            console.log(body);
        }
    }

    async edit(body: Partial<IPurposeSubject>) {
        try {
            const responce = await PurposeSubjectService.edit(body)
            // this.fetchAllPurposeSubjects(responce.data.id)
        } catch (e) {
            console.log(e);
        }
    }

    async remove(id: IPurposeSubject['id']) {
        try {
            await PurposeSubjectService.remove(id)
            this.setGroupPurposeSubjects(this.groupPurposeSubjects.filter(p => p.id !== id))
        } catch (e) {
            console.log(e);
        }
    }
}