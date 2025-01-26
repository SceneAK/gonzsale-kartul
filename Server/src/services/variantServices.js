import databaseInitializePromise from "../database/initialize.js";
const { Variant } = await databaseInitializePromise;

async function createVariants(variants, productId) 
{
    const variantsData = variants.map( variant => { 
        return {...variant, productId };
    } );
    const variantModels = await Variant.bulkCreate(variantsData);
    return variantModels.map( model => model.get());
}

async function updateVariants(variants, productId) { // temporary. very bad
    await Variant.destroy({ where: { productId } });
    return createVariants(variants, productId);
}

export default { createVariants, updateVariants };