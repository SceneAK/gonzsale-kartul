import express from 'express';
import productController from '../controllers/productController.js';
const router = express.Router();

router.get('/display-product/:id', async (req, res) => {
    await productController.fetchProduct(req, {
        json: function (productData){
            const currentUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

            const firstImageUrl = productData.ProductImages[0]?.url;
            res.render('display-product', { 
                title: productData.name,
                imageUrl: firstImageUrl || "assets/images/placeholder.png",
                url: currentUrl,
                productData 
            });
        }
    });
});

export default router;