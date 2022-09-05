const jwt = require("jsonwebtoken");
const {RoleAccess} = require("../models/models");
const {Op} = require("sequelize");

module.exports = async function (req, res, next){
    if (req.method === "OPTIONS"){
        next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token){
            return res.status(401).json({message: "Not authorized"});
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const {roleId,company} = decoded;
        const access = await RoleAccess.count({where: {[Op.and]:[{id: roleId}, {companyId: company.id}]}});

        if (access == 0){
            return res.status(401).json({message: "Access denied"});
        }
        // req.companyId = company.id;
        // ФУНКЦИЯ ПРОВЕРЯЮЩАЯ ПРАВА НА ДОСТУП

        next();
    } catch(e){
        res.status(401).json({message: "Not authorized"});
    }
}