import { makeAutoObservable } from 'mobx';
import { ISpeciality } from '@app/types/types';
import SpecialityService from '@entities/speciality/api/speciality.service';

export default class SpecialityStore {

    specialities: ISpeciality[] = [];

    constructor() {
        makeAutoObservable(this)
    }

    setSpecialities(specialities: ISpeciality[]) {
        this.specialities = specialities
    }

    async fetchAllSpecialities() {
        try {
            const responce = await SpecialityService.getAll()
            this.setSpecialities(responce.data.specialities)
        } catch (e) {
            console.log(e)
        }
    }

    async add(body: Omit<ISpeciality, 'id'>) {
        try {
            await SpecialityService.add(body)
            this.fetchAllSpecialities()
        } catch (e) {
            console.log(e);
        }
    }

    async edit(body: Partial<ISpeciality>) {
        try {
            await SpecialityService.edit(body)
            this.fetchAllSpecialities()
        } catch (e) {
            console.log(e);
        }
    }

    async remove(id: ISpeciality['id']) {
        try {
            await SpecialityService.remove(id)
            this.setSpecialities(this.specialities.filter(s => s.id !== id))
        } catch (e) {
            console.log(e);
        }
    }
}