function flattenProductImages(product)
{
    for (let i = 0; i < product.ProductImages?.length; i++) {
        const {Image, ...rest} = product.ProductImages[i];
        product.ProductImages[i] = {...Image, ...rest}
    }
}
export default {flattenProductImages}
