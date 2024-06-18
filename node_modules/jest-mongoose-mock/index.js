const MODEL_METHODS = require("./methods");
const _ = require('underscore');

class MockModel {
    constructor() {
        this.dbRows = [];
        this.queryResult = null;

        for (let method of MODEL_METHODS) {
            const isFindOneOperation = method.indexOf('findOne') !== -1;
            const isFindOperation = method.indexOf('find') !== -1 && !isFindOneOperation;

            this[method] = jest.fn((query) => {
                if(isFindOneOperation){
                    this.queryResult = _.findWhere(this.dbRows, query);
                }

                if(isFindOperation){
                    this.queryResult = _.where(this.dbRows, query);
                }
                
                return this;
            });

            this.then = jest.fn((cb) => {
                return Promise.resolve(cb(this.queryResult))
            });

            this.exec = jest.fn((cb) => {
                if(cb){
                    cb(err, this.queryResult);
                }
                
                return this;
            });
        }
    }

    _setMockData(results){
        this.dbRows = results;
    }
}

module.exports = MockModel;
