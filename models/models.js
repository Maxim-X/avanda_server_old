const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const Company = sequelize.define( 'company', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
});

const User = sequelize.define( 'user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    // id_role: {type: DataTypes.INTEGER},
});

const RoleAccess = sequelize.define( 'role_access', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    is_admin: {type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false},
    all_access: {type: DataTypes.JSON, allowNull: true},
    //id_company :{type: DataTypes.INTEGER, allowNull: false},
});

const Client = sequelize.define( 'client', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    driver_license_number: {type: DataTypes.STRING, allowNull: true},
    passport_number: {type: DataTypes.STRING, allowNull: true},
    birthday: {type: DataTypes.DATEONLY, allowNull: true},
    another_document_name: {type: DataTypes.STRING, allowNull: true},
    another_document_number: {type: DataTypes.STRING, allowNull: true},
    address: {type: DataTypes.STRING, allowNull: true}
    //id_company :{type: DataTypes.INTEGER, allowNull: false},
});

const PhoneNumbers = sequelize.define('phone_numbers',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    number: {type: DataTypes.STRING, allowNull: false},
});
const ClientsEmail  = sequelize.define('clients_email',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, allowNull: false},
});

const ImagesClient = sequelize.define('images_client',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    path: {type: DataTypes.STRING, allowNull: false},
});

const Stock = sequelize.define('stock', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    vendor_code: {type: DataTypes.STRING, allowNull: false},
    inventory_number: {type: DataTypes.STRING, allowNull: false},
    note: {type: DataTypes.TEXT, allowNull: true},
    inspection_date: {type: DataTypes.DATEONLY, allowNull: true},
    oil_change: {type: DataTypes.DATEONLY, allowNull: true}
})

const RentalPoints = sequelize.define('rental_points', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false}
})

const RentalCategories = sequelize.define('rental_categories', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false}
})

const RentalStatuses = sequelize.define('rental_statuses', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false}
})

const ImagesStock = sequelize.define('images_stock',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    path: {type: DataTypes.STRING, allowNull: false},
});

Company.hasMany(RoleAccess);
RoleAccess.belongsTo(Company);

Company.hasMany(Client);
Client.belongsTo(Company);

RoleAccess.hasOne(User);
User.belongsTo(RoleAccess);

Client.hasMany(PhoneNumbers);
PhoneNumbers.belongsTo(Client);

Client.hasMany(ClientsEmail);
ClientsEmail.belongsTo(Client);

Client.hasMany(ImagesClient);
ImagesClient.belongsTo(Client);

Company.hasMany(Stock);
Stock.belongsTo(Company);

Stock.hasMany(ImagesStock);
ImagesStock.belongsTo(Stock);

Company.hasMany(RentalPoints);
RentalPoints.belongsTo(Company);

RentalPoints.hasOne(Stock);
Stock.belongsTo(RentalPoints);

RentalCategories.hasOne(Stock);
Stock.belongsTo(RentalCategories);

RentalStatuses.hasOne(Stock);
Stock.belongsTo(RentalStatuses);

module.exports = {
    Company,
    User,
    RoleAccess,
    Client,
    PhoneNumbers,
    ClientsEmail,
    ImagesClient,
    Stock,
    RentalPoints,
    RentalCategories,
    RentalStatuses,
    ImagesStock
};