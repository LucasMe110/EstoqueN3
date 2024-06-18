# jest-mongoose-mock
Simple mongoose model mocks for jest unit tests

### Sample usage


```javascript
//users.controller.test.js

const MockModel = require("jest-mongoose-mock");
jest.mock("./user.model", () => new MockModel());
const Users = require("./user.model");
const usersController = require("./users.controller");

describe("registerUser", () => {
    let req, res;
    beforeEach(() => {
        jest.clearAllMocks();  //reset mock calls
        req = { body: {} };
        res = { json: jest.fn() };
    })
    it("Calls create & exec methods on User model", () => {
        usersController.register(req, res);
        expect(Users.create.mock.calls.length).toBe(1);
        expect(Users.exec.mock.calls.length).toBe(1);
    });
});

```

```javascript
//users.controller.js

const Users = require("../models/User.model");

exports.register = (req, res) => {
    const user = req.body;
    Users.create(user).exec((e, user) => {
        if (e) {
            return res.send(e);
        }
        res.json(user);
    });
};
```

```javascript
//user.model.js

const mongoose = require("mongoose");

const schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
});

const Users = mongoose.model("User", schema, "users");
```
