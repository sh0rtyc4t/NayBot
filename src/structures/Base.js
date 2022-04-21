const configuration = require("./Configurations.js");
const database = require("../modules/Database.js");
const fs = require("fs");
const Eris = require("eris");
const path = require("path");

module.exports = class Base {
    constructor (nay) {
        this.nay = nay;
        this.config = configuration;
        this.db = database.db;
        this.modules = {
            fs,
            Eris,
            path
        };
    }
};