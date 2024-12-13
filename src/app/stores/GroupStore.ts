import { makeAutoObservable } from 'mobx';
import { IGroup } from '@app/types/types';
import GroupService from '@entities/group/api/group.service';

export default class GroupStore {

    groups = [] as IGroup[];
    currentGroup = 4 as IGroup['id'];

    constructor() {
        makeAutoObservable(this)
    }

    setGroups(groups: IGroup[]) {
        this.groups = groups
    }

    setCurrentGroup(currentGroup: IGroup['id']) {
        this.currentGroup = currentGroup
    }

    async fetchAllGroups() {
        try {
            const responce = await GroupService.getAll()
            this.setGroups(responce.data.group)
        } catch (e) {
            console.log(e)
        }
    }

    async add(body: Omit<IGroup, 'id'>) {
        try {
            await GroupService.add(body)
            this.fetchAllGroups()
        } catch (e) {
            console.log(e);
            console.log(body);
        }
    }

    async edit(body: Partial<IGroup>) {
        try {
            await GroupService.edit(body)
            this.fetchAllGroups()
        } catch (e) {
            console.log(e);
        }
    }

    async remove(id: IGroup['id']) {
        try {
            await GroupService.remove(id)
            this.setGroups(this.groups.filter(g => g.id !== id))
        } catch (e) {
            console.log(e);
        }
    }
}