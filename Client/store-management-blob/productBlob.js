import { product, variant } from '../integration/fetches.js'
import { resetRecordedVariants, saveAndCloneRecordedVariants } from './variantBlob.js';
import common from '../common.js';

const productList = document.getElementById('product-list')
const modal = document.getElementById('product-variant-modal');

loadProducts();
// Load products data
async function loadProducts() {
    const result = await product.fetchOwnedProducts(1)
    const products = result.items
    productList.innerHTML = products.map(product => `
            <tr>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>Rp ${product.Variants[0]?.price.toLocaleString('id-ID')}</td>
                <td>
                    <button class="edit-btn" onclick="openEditProductModal('${product.id}')">Edit</button>
                    <button class="delete-btn" onclick="deleteProduct('${product.id}')">Delete</button>
                </td>
            </tr>
        `).join('')
}
window.deleteProduct = async function (id) {
    try {
        await product.deleteProduct(id);
        loadProducts();

    } catch (err) { alert('error deleting product') }
}


//#region Product Modal
const modalSubmit = document.getElementById('modal-submit');

const modalH1 = document.getElementById('modal-h1');
window.openModalAsCreateProduct = function()
{
    modalH1.innerHTML = 'Add Product';
    common.setValuesOfSelector('.product-inputs', modal, { name:"", description:"", category:""});

    resetRecordedVariants({name: "Default", isDefault: true, unit: "Unit"});

    modal.classList.add('active')
    modalSubmit.addEventListener('submit', async function (event){
        event.preventDefault();
        //await createProduct(); 
        modal.classList.remove('active');
    });
}

async function createProduct()
{
    const productData = common.getAllNameValueOfSelector('.product-inputs', modal);
    common.convertAvailabilityKey(productData);
    const variantData = saveAndCloneRecordedVariants();
    const defaultVariant = pullOutDefault(variantData);
    
    const result = await product.createProduct({
        ...productData,
        DefaultVariantData: defaultVariant
    })
    await product.createProductImages(result.id, getProductImageFormData());
    await variant.createVariant(result.id, variantData);
}
function pullOutDefault(variantData)
{
    const defaultIndex = variantData.findIndex( variant => variant.isDefault );
    return variantData.splice(defaultIndex, 1);
}

window.openModalAsEditProduct = function()
{
    modalH1.innerHTML = 'Edit Product';
    
    modalSubmit.onclick = createProduct;
}
function editProduct()
{

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
//#region fileInput loic
const productImagesInput = document.getElementById("product-images");
let eventDueToUpdateFileInputUI = false;
productImagesInput.addEventListener("change", function (event) {
    event.preventDefault();

    if(eventDueToUpdateFileInputUI){
        eventDueToUpdateFileInputUI = false
        return;
    }
    const previewContainer = document.getElementById("image-preview-container");
    previewContainer.innerHTML = "";

    includePreviousFiles(productImagesInput)

    populateImagePreview(previewContainer, productImagesInput.files, function(fileToRemove, index){
        removeFromFileInput(productImagesInput, index);
    });
});

function populateImagePreview(previewContainer, files, removeImageHandler)
{
    Array.from(files).forEach( (file, index)=> {
        const reader = new FileReader();
        reader.onload = function (e) {
            const wrapper = document.createElement("div");
            wrapper.classList.add("image-preview-wrapper");

            const deleteElement = createDeleteElement(function(){
                removeImageHandler(file, index);
                previewContainer.removeChild(wrapper);
            });
            wrapper.appendChild(deleteElement);

            const img = document.createElement("img");
            img.src = e.target.result;
            img.classList.add("image-preview");
            wrapper.appendChild(img);

            previewContainer.appendChild(wrapper);
        };
        reader.readAsDataURL(file);
    });
}

const previousDt = new DataTransfer();
function includePreviousFiles(fileInput) {
    const previousArr = Array.from(previousDt.files);
    const newArr = Array.from(fileInput.files);

    if(previousArr.length + newArr.length > 4){
        newArr.splice(0, 4-previousArr.length);
    }

    newArr.forEach( file => {
        if(!previousArr.includes(file)) previousDt.items.add(file)
    })
    fileInput.files = previousDt.files;
}

function removeFromFileInput(fileInput, index) {
    previousDt.items.remove(index);
    fileInput.files = previousDt.files; 
    console.log(fileInput.files);
}
function createDeleteElement(onClickHandler)
{
    const deleteButton = document.createElement("span");
    deleteButton.classList.add("delete-icon");
    deleteButton.textContent = "×";
    deleteButton.addEventListener('click', onClickHandler);
    return deleteButton;
}
function getProductImageFormData() {
    const formData = new FormData();
    for (let i = 0; i < productImagesInput.files.length; i++) {
        formData.append('images', productImagesInput.files[i]);
    }
    return formData;
}
//#endregion

//#endregion

//#region Edit Product
let inputDetected;
window.openEditProductModal = async function (productId) {
    inputDetected = false;

    const productData = await product.fetchProduct(productId)
    setEditProduct(productData)
}

function setEditProduct(productData) {
    editingProductId = productData.id;
    common.setValuesOfSelector('.product-inputs', editProductVariantForm, productData)
    common.setAvailabilityElementValue(document.getElementById('edit-product-availability'), productData.isAvailable);
    document.getElementById('edit-product-availability')

    editPreviewContainer.innerHTML = "";
    productData.ProductImages?.forEach(src => {
        const img = document.createElement('img')
        img.src = src.url
        img.classList.add('image-preview')
        editPreviewContainer.appendChild(img)
    })
}
//#endregion
