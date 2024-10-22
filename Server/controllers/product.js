const {query} = require("../db")

const getProducts = async (req, res) => {
    
}

const getProduct = async (req, res) => {
    const {id} = req.params;

}

module.exports = {
    getProduct,
    getProducts
}