import { makeAutoObservable } from 'mobx';
import { IAcademicSubject, IPurposeSubject } from '@app/types/types';
import PurposeSubjectService from '@entities/purposeSubject/api/PurposeSubject.service';

export default class PurposeSubjectStore {

    purposeSubjects = [] as IPurposeSubject[];

    constructor() {
        makeAutoObservable(this)
    }

    setPurposeSubjects(PurposeSubjects: IPurposeSubject[]) {
        this.purposeSubjects = PurposeSubjects
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