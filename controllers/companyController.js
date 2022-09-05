const {Company} = require("../models/models");

class CompanyController {
    async create(req, res){
        const {name} = req.body;
        const company = await Company.create({name});
        return res.json(company);
    }

    async getAll(req, res){
        const company = await Company.findAll();
        return res.json(company);
    }

    async getOne(req, res){

    }

}

module.exports = new CompanyController();