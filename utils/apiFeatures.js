class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  // search(modelName) {
  //   if (this.queryString.keyword) {
  //     let query = {};
  //     if (modelName === "Products") {
  //       query.$or = [
  //         { title: { $regex: this.queryString.keyword, $options: "i" } },
  //         { description: { $regex: this.queryString.keyword, $options: "i" } },
  //       ];
  //     } else if (modelName === "Category") {
  //       query = {
  //         categoryname: { $regex: this.queryString.keyword, $options: "i" },
  //       };
  //     } else {
  //       query = {
  //         categoryname: { $regex: this.queryString.keyword, $options: "i" },
  //       };
  //     }
  //     this.mongooseQuery = this.mongooseQuery.find(query);
  //   }
  //   return this;
  // }
}

module.exports = ApiFeatures;
