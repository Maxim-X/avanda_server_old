const {Client, User, PhoneNumbers, ClientsEmail, ImagesClient} = require("../models/models");
const ApiError = require("../error/ApiError");
const {Op} = require("sequelize");
const uuid = require('uuid');
const path = require('path');
const fs = require('fs').promises;
class ClientController {
    async create(req, res, next){
        let {name, email, driver_license_number, numberPass, birthday, another_document_name, another_document_number, phonesClient, emailClient, address} = req.body.client;
        const id_company = req.user.company.id;

        if(name != null)  name = name.trim();
        if(email != null)  email = email.trim();
        if(driver_license_number != null)  driver_license_number = driver_license_number.trim();
        if(numberPass != null)  numberPass = numberPass.trim();
        if(birthday != null)  birthday = birthday.trim();
        if(another_document_name != null)  another_document_name = another_document_name.trim();
        if(address != null)  address = address.trim();
        if(another_document_number != null)  another_document_number = another_document_number.trim();
        if (!name || name.length == 0){
            return next(ApiError.badRequest("First and last name not specified"));
        }
        const check_user = await Client.findOne({where:{name}})
        if (check_user){
            return next(ApiError.badRequest("Client already added"));
        }
        if (!id_company || id_company <= 0){
            return next(ApiError.badRequest("Company not specified"));
        }
        if (!email || email.length == 0){
            email = null;
        }
        if (!driver_license_number || driver_license_number.length == 0){
            driver_license_number = null;
        }
        if (!numberPass || numberPass.length == 0){
            numberPass = null;
        }
        if (!birthday || birthday.length == 0){
            birthday = null;
        }
        if (!another_document_name || another_document_name.length == 0){
            another_document_name = null;
        }
        if (!another_document_number || another_document_number.length == 0){
            another_document_number = null;
        }
        if (!address || address.length == 0){
            address = null;
        }
        const add_client = await Client.create(
            {
                name,
                email,
                driver_license_number: driver_license_number,
                passport_number: numberPass,
                birthday,
                companyId: id_company,
                another_document_name: another_document_name,
                another_document_number: another_document_number,
                address: address
            });

        phonesClient.map(async (number)=>{
            if (number && number.length > 5){
                const phone = await PhoneNumbers.create({number,clientId: add_client.id});
            }
        });

        emailClient.map(async (email)=>{
            if (email && email.length > 5){
                const add_email = await ClientsEmail.create({email,clientId: add_client.id});
            }
        });

        return res.json({status: true, message:"Client added", client_id: add_client.id});

    }

    async edit(req, res, next){
        let {name, email, driver_license_number, numberPass, birthday, another_document_name, another_document_number, address} = req.body.client;
        const {id_client} = req.body;
        const id_company = req.user.company.id;
        if(name != null) name = name.trim();
        if(email != null) email = email.trim();
        if(driver_license_number != null) driver_license_number = driver_license_number.trim();
        if(numberPass != null) numberPass = numberPass.trim();
        if(birthday != null) birthday = birthday.trim();
        if(another_document_name != null) another_document_name = another_document_name.trim();
        if(another_document_number != null) another_document_number = another_document_number.trim();
        if(address != null) address = address.trim();

        if (!name || name.length == 0){
            return next(ApiError.badRequest("First and last name not specified"));
        }
        const client = await Client.findOne({where:{[Op.and]:[{id: id_client}, {companyId: id_company}]}})
        if (!client){
            return next(ApiError.badRequest("Client not specified"));
        }
        if (!id_company || id_company <= 0){
            return next(ApiError.badRequest("Company not specified"));
        }
        if (!id_client || id_client <= 0){
            return next(ApiError.badRequest("Client not specified"));
        }
        if (!email || email.length == 0){
            email = null;
        }
        if (!driver_license_number || driver_license_number.length == 0){
            driver_license_number = null;
        }
        if (!numberPass || numberPass.length == 0){
            numberPass = null;
        }
        if (!birthday || birthday.length == 0){
            birthday = null;
        }
        if (!another_document_name || another_document_name.length == 0){
            another_document_name = null;
        }
        if (!another_document_number || another_document_number.length == 0){
            another_document_number = null;
        }
        if (!address || address.length == 0){
            address = null;
        }
        client.set({
            name: name,
            email: email,
            driver_license_number,
            numberPass,
            birthday,
            another_document_name,
            another_document_number,
            address: address
        });

        const save = await client.save();
        return res.json({status: true, message:"Client edit"});
    }


    async delete(req, res, next){
        const id_company = req.user.company.id;
        let {id_client} = req.query;
        const client = await Client.findOne({where:{[Op.and]:[{id: id_client}, {companyId: id_company}]}})
        if (!client){
            return next(ApiError.badRequest("Client not specified"));
        }
        // Удаляем номера телефонов клиента
        await PhoneNumbers.destroy({where:{clientId: id_client}})

        // Удаляем почтовые адреса клиента
        await ClientsEmail.destroy({where:{clientId: id_client}})

        // Удаляем картинки клиента
        const all_images = await ImagesClient.findAll({where:{clientId: id_client}})
        for (const image of all_images){
            let file = path.resolve(__dirname, '..', 'static', 'images', image.path);
            await fs.unlink(file);
            const del_images = await ImagesClient.destroy({where:{id: image.id}});
        }

        const del = await Client.destroy({where:{id: id_client}});
        return res.json({status: true, message:"Client removed"});

    }

    async getAll(req, res, next){

        const id_company = req.user.company.id;
        if (!id_company){
            return next(ApiError.badRequest("Incorrect data entered"));
        }
        const clients = await Client.findAll({where: {companyId: id_company}});
        for (const client of clients) {
            console.log(client);
            const phones = await PhoneNumbers.findAll({where: {clientId: client.id}, attributes:['number']});
            let all_numbers = "";
            for (const phone of phones){
                all_numbers = all_numbers+" "+phone.number;
            }

            const emails = await ClientsEmail.findAll({where: {clientId: client.id}, attributes:['email']});
            let all_emails = "";
            for (const email of emails){
                all_emails = all_emails+" "+email.email;
            }
            client['dataValues']['phone'] = all_numbers;
            client['dataValues']['email'] = all_emails;
        }
        return res.json(clients);
    }

    async getOne(req, res, next){
        const {id_client} = req.query;
        const id_company = req.user.company.id;
        if (!id_company){
            return next(ApiError.badRequest("Incorrect data entered"));
        }
        if (!id_client || id_client <= 0){
            return next(ApiError.badRequest("Incorrect data entered"));
        }
        const client = await Client.findOne({where: {[Op.and]:[{id: id_client}, {companyId: id_company}]}});

        return res.json(client);
    }

    async addPhone(req, res, next){
        let {id_client, number} = req.body;
        const id_company = req.user.company.id;
        number = number.trim();
        if (!id_company){
            return next(ApiError.badRequest("Incorrect data entered"));
        }
        if (!id_client || id_client <= 0){
            return next(ApiError.badRequest("Incorrect data entered"));
        }
        if (!number || number.length <= 5){
            return next(ApiError.badRequest("Invalid phone number entered"));
        }
        const phone_check = await PhoneNumbers.findOne({where: {[Op.and]:[{clientId: id_client}, {number}]}})
        if (phone_check){
            return next(ApiError.badRequest("Number already added"));
        }
        const phone = await PhoneNumbers.create({number,clientId: id_client});
        return res.json(phone);
    }

    async delPhone(req, res,next){
        let {id_client, number} = req.body;
        number = number.trim();
        if (!id_client || id_client <= 0){
            return next(ApiError.badRequest("Incorrect data entered"));
        }
        if (!number || number.length <= 5){
            return next(ApiError.badRequest("Invalid phone number entered"));
        }
        const del_phone = await PhoneNumbers.destroy({where:{[Op.and]:[{number},{clientId: id_client}]}});
        return res.json(del_phone);
    }

    async getAllPhones(req, res, next){
        const {id_client} = req.query;
        if (!id_client){
            return next(ApiError.badRequest("Incorrect data entered"));
        }
        const all_phones = await PhoneNumbers.findAll({where: {clientId: id_client}});

        return res.json(all_phones);
    }

    async addEmail(req, res, next){
        let {id_client, email} = req.body;
        if(email != null) email = email.trim();
        if (!id_client || id_client <= 0){
            return next(ApiError.badRequest("Incorrect data entered"));
        }
        if (!email || email.length <= 5){
            return next(ApiError.badRequest("Invalid Email entered"));
        }
        const email_check = await ClientsEmail.findOne({where: {[Op.and]:[{clientId: id_client}, {email}]}})
        if (email_check){
            return next(ApiError.badRequest("Email already added"));
        }
        const email_add = await ClientsEmail.create({email,clientId: id_client});
        return res.json(email_add);
    }

    async delEmail(req, res,next){
        let {id_client, email} = req.body;
        if(email != null) email = email.trim();
        if (!id_client || id_client <= 0){
            return next(ApiError.badRequest("Incorrect data entered"));
        }
        if (!email || email.length <= 5){
            return next(ApiError.badRequest("Invalid Email entered"));
        }
        const del_email = await ClientsEmail.destroy({where:{[Op.and]:[{email},{clientId: id_client}]}});
        return res.json(del_email);
    }

    async getAllEmail(req, res, next){
        const {id_client} = req.query;
        if (!id_client){
            return next(ApiError.badRequest("Incorrect data entered"));
        }
        const all_email= await ClientsEmail.findAll({where: {clientId: id_client}});

        return res.json(all_email);
    }

    async uploadImages(req, res, next){
        try {
            const {id_client} = req.body;
            const {images} = req.files;
            const expanse = images.name.split('.').pop();
            if (['png', 'jpg', 'jpeg'].indexOf(expanse) < 0){
                return next(ApiError.badRequest("Photo extension is not supported"));
            }
            let fileName = uuid.v4() + "."+expanse
            images.mv(path.resolve(__dirname, '..', 'static', 'images', fileName));
            const add_images = ImagesClient.create({path: fileName, clientId: id_client});
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
        let checkImage = await ImagesClient.findOne({where:{path: images_name}});
        console.log(checkImage);
        if (!checkImage){
            return next(ApiError.badRequest("Incorrect data entered"));
        }
        let checkClient = await Client.findOne({where:{[Op.and]:[{id: checkImage.clientId}, {companyId:id_company}]}});
        console.log(checkClient);
        if (!checkClient){
            return next(ApiError.badRequest("Incorrect data entered"));
        }

        let file = path.resolve(__dirname, '..', 'static', 'images', images_name);
        await fs.unlink(file);
        const del_images = await ImagesClient.destroy({where:{id: checkImage.id}});
        return res.json(del_images);
    }

    async getAllImages(req, res, next){
        const {id_client} = req.query;
        console.log(id_client);
        if (!id_client){
            return next(ApiError.badRequest("Incorrect data entered"));
        }
        const all_images= await ImagesClient.findAll({where: {clientId: id_client}});

        return res.json(all_images);
    }

}

module.exports = new ClientController();