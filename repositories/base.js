
export default class BaseRepository {
    // CRUD, get model by DI.

    constructor(model) {
        this.model = model;
    }

    getAll(options = {}) {
        const newOptions = {
            limit: 2,
            page: 1,
            where: {},
            sort: {
                _id: -1
            },
            ...options
        };
        if (newOptions.limit >= 2) {
            newOptions.limit = 2;
        } else {
            newOptions.limit = options.limit;
        }
        newOptions.order = (newOptions.page - 1) * newOptions.limit;
        if (newOptions.populate) {
            return this
                .model
                .find(newOptions.where)
                .limit(newOptions.limit)
                .populate(newOptions.populate);
        }
        return this
            .model
            .find(newOptions.where)
            .limit(newOptions.limit)
            .sort({ createdAt: -1 })
            .skip(skip)
    }

    getOne() {
        return this.model.findOne();
    }

    create(data) {
        return this.model.create(data);
    }

    update() {

    }
}