"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductById = exports.updateProductById = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const database_1 = require("../config/database");
const createProduct = async (req, res) => {
    const { product_name, quantity, price } = req.body;
    try {
        const { rows } = await database_1.db.query("INSERT INTO Products (productName, quantity, price) VALUES ($1, $2, $3)", [product_name, quantity, price]);
        res.status(201).send({
            message: "Product added successfully!",
            body: {
                product: { product_name, quantity, price }
            },
        });
    }
    catch (err) {
        console.error(`Erro na inserção do produto novo: ${err}`);
        res.status(500).send({
            message: "Erro na inserção do produto novo!",
            error: err
        });
    }
};
exports.createProduct = createProduct;
const getProducts = async (req, res) => {
    try {
        const { rows } = await database_1.db.query("SELECT * FROM Products");
        res.status(200).send({
            message: "Products got successfully!",
            body: {
                products: rows
            }
        });
    }
    catch (err) {
        res.status(500).send({
            message: "Can not search products!",
            error: err
        });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    const searchParams = new URLSearchParams(req.params);
    const id = searchParams.get('id');
    try {
        const { rows } = await database_1.db.query("SELECT * FROM Products as P WHERE P.productId = $1", [id]);
        res.status(200).send({
            message: "Product got successfully!",
            products: rows
        });
    }
    catch (err) {
        res.status(500).send({
            message: "Can not search products!",
            error: err
        });
    }
};
exports.getProductById = getProductById;
const updateProductById = async (req, res) => {
    const searchParams = new URLSearchParams(req.params);
    const id = searchParams.get('id');
    const { product_name, quantity, price } = req.body;
    try {
        const { row } = await database_1.db.query("UPDATE Products as P SET productName = $1, quantity = $2, price = $3 WHERE productId = $4", [product_name, quantity, price, id]);
        res.status(201).send({
            message: "Product updated successfully!",
            product: {
                "productName": product_name,
                "quantity": quantity,
                "price": price
            }
        });
    }
    catch (err) {
        res.status(500).send({
            message: "Can not update product!",
            error: err
        });
    }
};
exports.updateProductById = updateProductById;
const deleteProductById = async (req, res) => {
    const searchParams = new URLSearchParams(req.params);
    const id = searchParams.get('id');
};
exports.deleteProductById = deleteProductById;
