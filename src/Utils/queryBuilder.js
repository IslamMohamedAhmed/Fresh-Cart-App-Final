export class QueryBuilder {
    constructor(mongooseQuery, searchQuery, searchFields = []) {
        this.mongooseQuery = mongooseQuery;
        this.searchQuery = searchQuery;
        this.searchFields = Array.isArray(searchFields) ? searchFields : [];
        this.pageNumber = 1;
        this.totalItems = 0;
        this.totalPages = 0;
        this.pageLimit = 10;
        this.filterObj = {};
        

    }

    filter() {

        let filterObj = { ...this.searchQuery };
        let excludedFields = ['page', 'sort', 'fields', 'keyword', 'limit'];

        excludedFields.forEach(val => {
            delete filterObj[val];
        });
        for (const key in filterObj) {
            const value = filterObj[key];
            if (typeof value === 'object' && value !== null) {
                for (const op in value) {
                    const allowedOps = ['gt', 'gte', 'lt', 'lte'];
                    if (!allowedOps.includes(op)) delete value[op];
                    else value[op] = this._autoParse(value[op]);
                }
            } else {
                filterObj[key] = this._autoParse(value);
            }
        }


        filterObj = JSON.stringify(filterObj);
        filterObj = filterObj.replace(/(gt|gte|lt|lte)/g, match => `$${match}`);
        filterObj = JSON.parse(filterObj);
        this.filterObj = filterObj;
        return this;
    }

    sort() {
        if (this.searchQuery.sort) {
            let sortBy = this.searchQuery.sort.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        }
        return this;
    }

    fields() {
        if (this.searchQuery.fields) {
            let fields = this.searchQuery.fields.split(',').join(' ');
            this.mongooseQuery = this.mongooseQuery.select(fields);
        }
        return this;
    }

    search() {

        const fields = Array.isArray(this.searchFields) ? this.searchFields : [];

        if (this.searchQuery.keyword && Array.isArray(fields) && fields.length > 0) {
            const keyword = this.escapeRegex(this.searchQuery.keyword);
            const orConditions = fields.map(field => ({
                [field]: { $regex: keyword, $options: 'i' }
            }));
            this.filterObj.$or = orConditions;
        }
        return this;
    }

    async pagination() {
        if (this.searchQuery.page <= 0) this.searchQuery.page = 1;
        let pageNumber = this.searchQuery.page * 1 || 1;
        let pageLimit = this.searchQuery.limit * 1 || 10;
        let skip = (pageNumber - 1) * pageLimit;

        try {
            const totalItems = await this.mongooseQuery.clone().countDocuments();
            this.pageNumber = pageNumber;
            this.totalItems = totalItems;
            this.totalPages = Math.ceil(totalItems / pageLimit);
            this.pageLimit = pageLimit;
        } catch (err) {
            console.error("Error calculating total items:", err);
            this.pageNumber = pageNumber;
            this.totalItems = 0;
            this.totalPages = 0;
            this.pageLimit = pageLimit;
        }
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(pageLimit);
        return this;
    }

    _autoParse(val) {
        // يحاول يحوّل string لـ boolean / number / date لو ينفع
        if (val === 'true') return true;
        if (val === 'false') return false;

        const num = Number(val);
        if (!Number.isNaN(num) && String(val).trim() !== '') return num;

        const d = new Date(val);
        if (!Number.isNaN(d.getTime())) return d;

        return val;
    }

    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    buildQuery() {
        this.mongooseQuery = this.mongooseQuery.find(this.filterObj);
        return this;
    }


}



