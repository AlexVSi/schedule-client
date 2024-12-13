import { makeAutoObservable } from 'mobx';
import { IAcademicSubject, IPurposeSubject } from '@app/types/types';
import PurposeSubjectService from '@entities/purposeSubject/api/PurposeSubject.service';

export default class PurposeSubjectStore {

    purposeSubjects = [] as IPurposeSubject[];
    groupPurposeSubjects = [] as IPurposeSubject[];

    constructor() {
        makeAutoObservable(this)
    }

    setPurposeSubjects(PurposeSubjects: IPurposeSubject[]) {
        this.purposeSubjects = PurposeSubjects
    }

    async fetchAllPurposeSubjects(id: IAcademicSubject['id']) {
        try {
            const responce = await PurposeSubjectService.getByAcademicSubject(id)
            this.setPurposeSubjects(responce.data.purposeSubjects)
            console.log(responce.data.purposeSubjects)
            return responce.data.purposeSubjects
        } catch (e) {
            console.log(e)
        }
    }

    async add(body: Omit<IPurposeSubject, 'id'>) {
        try {
            const responce = await PurposeSubjectService.add(body)
            this.fetchAllPurposeSubjects(responce.data.id)
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
            this.setPurposeSubjects(this.purposeSubjects.filter(g => g.id !== id))
        } catch (e) {
            console.log(e);
        }
    }
}