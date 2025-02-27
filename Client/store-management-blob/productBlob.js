import { product, variant } from '../integration/fetches.js'
import { resetRecordedVariants, saveAndCloneRecordedVariants, setRecordedVariants } from './variantBlob.js';
import common from '../common.js';
import PaginationManager from '../pagination.js';
import { deleteDeletedPreviewImages, getProductImageFormData, resetProductImages, setExistingProductImages } from './productImagesBlob.js';

const productList = document.getElementById('product-list')
const modal = document.getElementById('product-variant-modal');
const submitBtn = document.getElementById('submit-button');

const productDiv = document.getElementById('products');

const paginationManager = new PaginationManager(productDiv, loadProducts);
paginationManager.callLoadPageHandler();
// Load products data
async function loadProducts(page = 1) {
    const result = await product.fetchOwnedProducts(page)
    const products = result.items
    paginationManager.updatePaginationValues(products.length, result.totalItems, result.page, result.totalPages);

    productList.innerHTML = products.map(product => `
            <tr>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>Rp ${product.Variants[0]?.price.toLocaleString('id-ID')}</td>
                <td>
                    <button class="edit-btn" onclick="openModalAsEditProduct('${product.id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteProduct('${product.id}')">Delete</button>
                </td>
            </tr>
        `).join('')
}
window.deleteProduct = async function (id) {
    try {
        if(confirm("Are you sure you want to delete this product?")){
            await product.deleteProduct(id);
            paginationManager.callLoadPageHandler();
        }

    } catch (err) { alert('error deleting product') }
}


//#region Product Modal
const modalForm = document.getElementById('modal-form');

const modalH1 = document.getElementById('modal-h1');
window.openModalAsCreateProduct = function()
{
    prepareCreateProductModal();
    modal.classList.add('active')
    modalForm.onsubmit= async function (event){
        event.preventDefault();
        await createProduct(); 
        modal.classList.remove('active');
        paginationManager.callLoadPageHandler();
    };
}
function prepareCreateProductModal()
{
    modalH1.innerHTML = 'Add Product';
    submitBtn.innerHTML = 'Create Product';
    common.setValuesOfSelector('.product-inputs', modal, { name:"", description:"", category:""});
    
    resetProductImages();
    resetRecordedVariants();
}

async function createProduct()
{
    const productData = common.getAllNameValueOfSelector('.product-inputs', modal);
    common.convertAvailabilityKey(productData);
    const variantDataArr = saveAndCloneRecordedVariants();
    const defaultVariant = pullOutDefault(variantDataArr);
    
    const result = await product.createProduct({
        ...productData,
        defaultVariantData: defaultVariant
    })
    await product.createProductImages(result.id, getProductImageFormData());
    if(variantDataArr.length > 0)
    {
        await variant.createVariants(result.id, variantDataArr);
    }
}
function pullOutDefault(variantData)
{
    const defaultIndex = variantData.findIndex( variant => variant.isDefault );
    const defaultVariant = variantData.splice(defaultIndex, 1)[0];
    delete defaultVariant.isDefault;
    return defaultVariant;
}

window.closeModal = function () {
    modal.classList.remove('active')
}
document.addEventListener("click", event => {
    const modalContent = document.querySelector(".modal-form-container")
    if (modalContent.classList.contains("active") && !modalContent.contains(event.target)) {
        window.closeModal()
    }
})

//#endregion

//#region Edit Product
let inputDetected = false;
modalForm.oninput = function() { inputDetected = true; }
modalForm.onclick = function() { inputDetected = true; }
window.openModalAsEditProduct = async function(productId)
{
    inputDetected = false;
    const productData = await product.fetchProduct(productId)
    prepareEditProductModal(productData)

    modal.classList.add('active');
    modalForm.onsubmit = async function (event){
        event.preventDefault();
        if(inputDetected)
        {
            await editProduct(productData);
            paginationManager.callLoadPageHandler();
        }
        modal.classList.remove('active');
    }
}
async function editProduct(originalProductData)
{
    const productId = originalProductData.id;
    const editedData = common.getAllNameValueOfSelector('.product-inputs', modal);
    common.convertAvailabilityKey(editedData);
    await product.editProduct(productId, editedData);
    
    const variantDataArr = saveAndCloneRecordedVariants();
    const {toCreate, toEdit, toDelete} = variantDataArr.reduce( (accumulator, currentVariant) => {
        delete currentVariant.isDefault;
        if(currentVariant.id) {
            accumulator.toEdit.push(currentVariant);
            const thisIndex = accumulator.toDelete.findIndex( value => value.id == currentVariant.id )
            accumulator.toDelete.splice(thisIndex, 1 )
        }else {
            accumulator.toCreate.push(currentVariant);
        }
        return accumulator;
    }, { toCreate: [], toEdit: [], toDelete: originalProductData.Variants});    
    if(toCreate.length > 0) await variant.createVariants(productId, toCreate);
    if(toEdit.length > 0) toEdit.forEach( variantData => {
        const {id, ...rest} = variantData;
        variant.editVariant(id, rest).catch(err => alert(err.message))
    });
    if(toDelete.length > 0) toDelete.forEach( variantData => {
        variant.deleteVariant(variantData.id).catch(err => alert(err.message));
    })

    await deleteDeletedPreviewImages();
    const newImages = getProductImageFormData();
    if(newImages) await product.createProductImages(productId, newImages);
}
function prepareEditProductModal(productData) {
    modalH1.innerHTML = 'Edit Product';
    submitBtn.innerHTML = 'Edit';

    common.setValuesOfSelector('.product-inputs', modal, productData)
    common.setAvailabilityElementValue(document.getElementById('product-availability'), productData.isAvailable);

    resetProductImages();
    setExistingProductImages(productData.ProductImages);
    setRecordedVariants(productData.Variants);
}
//#endregion
