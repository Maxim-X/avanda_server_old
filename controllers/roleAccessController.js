const {Type, RoleAccess} = require('../models/models');
const ApiError = require('../error/ApiError');
class RoleAccessController {
    async create(req, res){

    }

    async get(req,res){

    }

    async getOne(req, res, next){
        const {idRole} = req.query;

        if (!idRole){
            return next(ApiError.badRequest("Incorrect data entered"));
        }

        const access_role = await RoleAccess.findOne({where:{id: idRole}});

        if (!access_role){
            return next(ApiError.badRequest("This role was not found"));
        }
        const {name, is_admin, all_access} = access_role;
        return res.json({name, is_admin, all_access});

    }

}

module.exports = new RoleAccessController();