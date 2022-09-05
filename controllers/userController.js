const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, RoleAccess, Company} = require('../models/models');

const generateJwt = (id, name, company,roleId, role) => {
    return jwt.sign({id, name, company, roleId, role}, process.env.SECRET_KEY, {expiresIn:'24h'});
}

class UserController {
    async reg(req, res, next){
        const {name, email, password} = req.body;
        if (!name || !email || !password){
            return next(ApiError.badRequest("Incorrect data entered"));
        }
        const candidate = await User.findOne({where: {email}});
        if (candidate){
            return next(ApiError.badRequest("User with this email already exists"));
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({name, email, password: hashPassword});
        const token = generateJwt(user.id, name, email);
        return res.json({token});

    }

    async login(req, res, next){
        const {email, password} = req.body;
        const user = await User.findOne({where: {email}});
        if (!user){
            return next(ApiError.internal('User is not found'));
        }
        let comparePassword = bcrypt.compareSync(password, user.password);
        if(!comparePassword){
            return next(ApiError.internal('Incorrect password specified'));
        }

        const access_role = await RoleAccess.findOne({where:{id: user.roleAccessId}});
        if (!access_role){
            return next(ApiError.internal("This role was not found"));
        }

        const company = await Company.findOne({where:{id: access_role.companyId}});
        if (!company){
            return next(ApiError.internal("This company was not found"));
        }

        const {id, name, is_admin, all_access} = access_role;
        const role = {id, name, is_admin, all_access};
        const token = generateJwt(user.id, user.name, company, user.roleAccessId, role);
        return res.json({token});
    }

    async check(req, res, next){
        console.log(req.user);
        const user = await User.findOne({where: {id:req.user.id}});
        const {roleAccessId} = user;
        const access_role = await RoleAccess.findOne({where:{id: roleAccessId}});
        const {name, is_admin, all_access} = access_role;
        const role = {name, is_admin, all_access};
        const token = generateJwt(req.user.id, req.user.name, req.user.company, roleAccessId, role);
        return res.json({token});
    }

    // async getInfo(req, res, next){
    //     let {userID} = req.query;
    //     if(!userID){
    //         return next(ApiError.badRequest("Incorrect data entered"));
    //     }
    //     let userInfo = await User.findOne({where: {id: userID}});
    // }
}

module.exports = new UserController();