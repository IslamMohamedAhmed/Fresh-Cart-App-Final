export class QueryBuilder {
    constructor(mongooseQuery, searchQuery) {
        this.mongooseQuery = mongooseQuery;
        this.searchQuery = searchQuery;
        this.pageNumber = 1;
        this.totalItems = 0;
        this.totalPages = 0;
        this.pageLimit = 10;
    }

    filter() {
        let filterObj = { ...this.searchQuery };
        let excludedFields = ['page', 'sort', 'fields', 'keyword'];

        excludedFields.forEach(val => {
            delete filterObj[val];
        });

        filterObj = JSON.stringify(filterObj);
        filterObj = filterObj.replace(/(gt|gte|lt|lte)/g, match => `$${match}`);
        filterObj = JSON.parse(filterObj);

        this.mongooseQuery = this.mongooseQuery.find(filterObj);
        return this;
    }

    sort() {
        if (this.searchQuery.sort) {
            let sortBy = this.searchQuery.sort.split(',').join(' ');
            console.log(sortBy);
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
        if (this.searchQuery.keyword) {
            this.mongooseQuery = this.mongooseQuery.find({
                $or: [
                    { title: { $regex: this.searchQuery.keyword, $options: 'i' } },
                    { description: { $regex: this.searchQuery.keyword, $options: 'i' } }
                ]
            });
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
}



// Example usage:
// const queryBuilder = new QueryBuilder(Model.find(), req.query);
// const result = await queryBuilder.filter().sort().fields().search().pagination().mongooseQuery;