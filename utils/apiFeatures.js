class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  search() {
    if (this.queryString.keyword) {
      const query = {};
      query.$or = [
        { title: { $regex: this.queryString.keyword, $options: "i" } },
        { description: { $regex: this.queryString.keyword, $options: "i" } },
      ];
      //$regex appartien ou pas
      //$options:"i"    capital letters are find same guitar or Guitar
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }
}
module.exports = ApiFeatures;
