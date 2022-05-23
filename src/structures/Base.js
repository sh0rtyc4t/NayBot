const configuration = require("./Configurations.js");
const database = require("../core/database/index.js");
const fs = require("fs");
const Eris = require("eris");
const path = require("path");

module.exports = class Base {
    constructor (nay) {
        this.nay = nay;
        this.config = configuration;
        this.db = database;
        this.modules = {
            fs,
            Eris,
            path
        };
    }
};