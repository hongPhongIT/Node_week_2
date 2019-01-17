import Group from '../models/group';
import BaseRepository from './base';

export default class GroupRepository extends BaseRepository {

    constructor() {
        super(Group);
    }

}