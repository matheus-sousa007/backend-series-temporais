import {db} from '../config/database';
import express from "express";

export const createProduct = async (req: any, res: any) => {
    const { product_name, quantity, price } = req.body;

    try{
        const { rows } = await db.query("INSERT INTO Products (productName, quantity, price) VALUES ($1, $2, $3)", [product_name, quantity, price]);
        
        res.status(201).send({
            message: "Product added successfully!",
            body: {
                product: {product_name, quantity, price}
            },
        })
    }
    catch (err){
        console.error(`Erro na inserção do produto novo: ${err}`)

        res.status(500).send({
            message: "Erro na inserção do produto novo!",
            error: err
        })

    }
}


export const getProducts = async (req: any, res: any) => {

    try {
        const { rows } = await db.query("SELECT * FROM Products");
    
        res.status(200).send({
            message: "Products got successfully!",
            body: {
                products: rows
            }
        })
    }
    catch (err) {
        res.status(500).send({
            message: "Can not search products!",
            error: err
        })
    }
}

export const getProductById = async(req: any, res: any) => {
    const searchParams = new URLSearchParams(req.params as any);
    const id = searchParams.get('id');

    try {
        const { rows } = await db.query("SELECT * FROM Products as P WHERE P.productId = $1", [id]);
        res.status(200).send({
            message: "Product got successfully!",
            products: rows 
        })
    }
    catch (err) {
        res.status(500).send({
            message: "Can not search products!",
            error: err
        })
    }

}

export const updateProductById = async (req: any, res: any) => {
    const searchParams = new URLSearchParams(req.params as any);
    const id = searchParams.get('id');

    const { product_name, quantity, price } = req.body;

    try {
        const { row } = await db.query("UPDATE Products as P SET productName = $1, quantity = $2, price = $3 WHERE productId = $4", [product_name, quantity, price, id]) 
        
        res.status(201).send({
            message: "Product updated successfully!",
            product: { 
                "productName": product_name, 
                "quantity": quantity, 
                "price": price
            }
        })
    }
    catch (err) {
        res.status(500).send({
            message: "Can not update product!",
            error: err
        })
    }
}

export const deleteProductById = async (req: any, res: any) => {
    const searchParams = new URLSearchParams(req.params as any);
    const id = searchParams.get('id');

    
}

export const teste = async (req: express.Request, res: express.Response) => {
    res.status(200).send({
        message: "Server funcionando com sucesso!",
    })
}