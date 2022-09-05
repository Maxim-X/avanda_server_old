const ApiError = require('../error/ApiError');
const {Stock, Client, PhoneNumbers, ClientsEmail, RentalPoints, RentalCategories, RentalStatuses, ImagesClient,
    ImagesStock
} = require("../models/models");
const {Op} = require("sequelize");
const uuid = require("uuid");
const path = require("path");
const {promises: fs} = require("fs");
const checkAccessCompanyMiddleware = require("../middleware/checkAccessCompanyMiddleware");


class StockController{
    async create(req, res, next){
        let {name, vendor_code, inventory_number, rentalPointId, rentalCategoryId, rentalStatusId, note, inspectionDate, oilChangeDate} = req.body.inventory;
        const id_company = req.user.company.id;

        name = name.trim();
        vendor_code = vendor_code.trim();
        inventory_number = inventory_number.trim();
        note = note.trim();
        inspectionDate = inspectionDate.trim();
        oilChangeDate = oilChangeDate.trim();

        if (!name || name.length == 0){
            return next(ApiError.badRequest("Name not specified"));
        }
        const check_user = await Stock.findOne({where:{name}})
        if (check_user){
            return next(ApiError.badRequest("Inventory already added"));
        }
        if (!id_company || id_company <= 0){
            return next(ApiError.badRequest("Company not specified"));
        }
        if (!vendor_code || vendor_code.length == 0){
            return next(ApiError.badRequest("Vendor code not specified"));
        }
        if (!inventory_number || inventory_number.length == 0){
            return next(ApiError.badRequest("Inventory number not specified"));
        }
        if (!rentalPointId || rentalPointId <= 0){
            return next(ApiError.badRequest("Rental point not specified"));
        }
        const checkRentalPointId = RentalPoints.findOne({where:{[Op.and]:[{companyId: id_company}, {id: rentalPointId}]}})
        if (!checkRentalPointId){
            return next(ApiError.badRequest("Rental point not specified"));
        }

        if (!rentalCategoryId || rentalCategoryId <= 0){
            return next(ApiError.badRequest("Rental category not specified"));
        }
        const checkRentalCategoryId = RentalCategories.findOne({where:{id: rentalCategoryId}});
        if (!checkRentalCategoryId){
            return next(ApiError.badRequest("Rental category not specified"));
        }

        if (!rentalStatusId || rentalStatusId <= 0){
            return next(ApiError.badRequest("Rental statuses not specified"));
        }
        const checkRentalStatusId = RentalStatuses.findOne({where:{id: rentalStatusId}});
        if (!checkRentalStatusId){
            return next(ApiError.badRequest("Rental statuses not specified"));
        }
        if (!note || note.length == 0){
            note = null;
        }
        if (!inspectionDate || inspectionDate.length == 0){
            inspectionDate = null;
        }
        if (!oilChangeDate || oilChangeDate.length == 0){
            oilChangeDate = null;
        }

        const add_inventory = await Stock.create(
            {
                name,
                vendor_code,
                inventory_number,
                companyId: id_company,
                rentalPointId,
                rentalCategoryId,
                rentalStatusId,
                note,
                inspection_date:inspectionDate,
                oil_change:oilChangeDate
            });

        return res.json({status: true, message:"Inventory added", inventory_id: add_inventory.id});
    }

    async edit(req, res, next){
        let {id, name, vendor_code, inventory_number, rentalPointId, rentalCategoryId, rentalStatusId, note, inspectionDate, oilChangeDate} = req.body.inventory;
        let {id_inventory} = req.body;
        const id_company = req.user.company.id;
        if(id != null) id = id.trim();
        if(name != null) name = name.trim();
        if(vendor_code != null) vendor_code = vendor_code.trim();
        if(inventory_number != null) inventory_number = inventory_number.trim();
        if(note != null) note = note.trim();
        if(inspectionDate != null) inspectionDate = inspectionDate.trim();
        if(oilChangeDate != null) oilChangeDate = oilChangeDate.trim();
        if (!name || name.length == 0){
            return next(ApiError.badRequest("Name not specified"));
        }
        const stock = await Stock.findOne({where:{[Op.and]:[{id: id_inventory},{companyId: id_company}]}})
        if (!stock){
            return next(ApiError.badRequest("Inventory already added"));
        }
        if (!id_company || id_company <= 0){
            return next(ApiError.badRequest("Company not specified"));
        }
        if (!vendor_code || vendor_code.length == 0){
            return next(ApiError.badRequest("Vendor code not specified"));
        }
        if (!inventory_number || inventory_number.length == 0){
            return next(ApiError.badRequest("Inventory number not specified"));
        }
        if (!rentalPointId || rentalPointId <= 0){
            return next(ApiError.badRequest("Rental point not specified"));
        }
        const checkRentalPointId = RentalPoints.findOne({where:{[Op.and]:[{companyId: id_company}, {id: rentalPointId}]}})
        if (!checkRentalPointId){
            return next(ApiError.badRequest("Rental point not specified"));
        }

        if (!rentalCategoryId || rentalCategoryId <= 0){
            return next(ApiError.badRequest("Rental category not specified"));
        }
        const checkRentalCategoryId = RentalCategories.findOne({where:{id: rentalCategoryId}});
        if (!checkRentalCategoryId){
            return next(ApiError.badRequest("Rental category not specified"));
        }

        if (!rentalStatusId || rentalStatusId <= 0){
            return next(ApiError.badRequest("Rental statuses not specified"));
        }
        const checkRentalStatusId = RentalStatuses.findOne({});
        if (!checkRentalStatusId){
            return next(ApiError.badRequest("Rental statuses not specified"));
        }
        if (!note || note.length == 0){
            note = null;
        }
        if (!inspectionDate || inspectionDate.length == 0){
            inspectionDate = null;
        }
        if (!oilChangeDate || oilChangeDate.length == 0){
            oilChangeDate = null;
        }

        stock.set({
            name,
            vendor_code,
            inventory_number,
            companyId: id_company,
            rentalPointId,
            rentalCategoryId,
            rentalStatusId,
            note,
            inspection_date:inspectionDate,
            oil_change:oilChangeDate
        });

        const save = await stock.save();
        return res.json({status: true, message:"Inventory edited"});
    }
    async getAll(req, res, next){
        const id_company = req.user.company.id;
        if (!id_company){
            return next(ApiError.badRequest("Incorrect data entered"));
        }
        const stock = await Stock.findAll({where: {companyId: id_company}});
        return res.json(stock);
    }

    async getOne(req, res, next){
        const {id_inventory} = req.query;
        const id_company = req.user.company.id;
        if (!id_company){
            return next(ApiError.badRequest("Incorrect data entered"));
        }
        const inventory = await Stock.findOne({where: {[Op.and]:[{id: id_inventory}, {companyId: id_company}]}});

        return res.json(inventory);
    }

    async delete(req, res, next){
        const id_company = req.user.company.id;
        let {id_stock} = req.query;
        const inventory = await Stock.findOne({where: {[Op.and]:[{id: id_stock}, {companyId: id_company}]}});
        if (!inventory){
            return next(ApiError.badRequest("Inventory is not specified"));
        }
        const del = await Stock.destroy({where:{id: id_stock}});
        return res.json({status: true, message:"Inventory removed"});

    }


    async uploadImages(req, res, next){
        const id_company = req.user.company.id;
        const {id_stock} = req.body;
        const {images} = req.files;

        try {
            const expanse = images.name.split('.').pop();
            let checkStock = await Stock.findOne({where:{[Op.and]:[{id: id_stock}, {companyId:id_company}]}});
            if (!checkStock){
                return next(ApiError.badRequest("Incorrect data entered"));
            }

            if (['png', 'jpg', 'jpeg'].indexOf(expanse) < 0){
                return next(ApiError.badRequest("Photo extension is not supported"));
            }
            let fileName = uuid.v4() + "."+expanse
            images.mv(path.resolve(__dirname, '..', 'static', 'images', fileName));
            const add_images = ImagesStock.create({path: fileName, stockId: id_stock});
            return res.json(add_images);
        }catch (e){
            return next(ApiError.badRequest("Incorrect data entered"));
        }
    }

    async deleteImages(req, res, next){
        const {images_name} = req.body;
        const id_company = req.user.company.id;
        if (!images_name){
            return next(ApiError.badRequest("Incorrect data entered"));
        }
        let checkImage = await ImagesStock.findOne({where:{path: images_name}});
        if (!checkImage){
            return next(ApiError.badRequest("Incorrect data entered"));
        }
        let checkStock = await Stock.findOne({where:{[Op.and]:[{id: checkImage.stockId}, {companyId:id_company}]}});
        if (!checkStock){
            return next(ApiError.badRequest("Incorrect data entered"));
        }

        let file = path.resolve(__dirname, '..', 'static', 'images', images_name);
        await fs.unlink(file);
        const del_images = await ImagesStock.destroy({where:{id: checkImage.id}});
        return res.json(del_images);
        // return res.json("dd");
    }

    async getAllImages(req, res, next){
        const {id_stock} = req.query;
        if (!id_stock){
            return next(ApiError.badRequest("Incorrect data entered"));
        }
        const all_images= await ImagesStock.findAll({where: {stockId: id_stock}});

        return res.json(all_images);
    }

    async getRentalPoints(req, res, next){
        const id_company = req.user.company.id;
        if (!id_company){
            return next(ApiError.badRequest("Incorrect data entered"));
        }
        const all_rental_points = await RentalPoints.findAll({where: {companyId: id_company}});

        return res.json(all_rental_points);
    }
    async getRentalCategory(req, res){
        const all_rental_category = await RentalCategories.findAll({});
        return res.json(all_rental_category);
    }

    async getRentalStatus(req, res){
        const all_rental_status= await RentalStatuses.findAll({});
        return res.json(all_rental_status);
    }


}

module.exports = new StockController();