import { product, variant } from '../integration/fetches.js'
import common from '../common.js';

const editProductVariantForm = document.getElementById('edit-product-variant-form');
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
window.openModal = function (mode) {
    switch (mode) {
        case 'add':
            prepareAddProduct();
            break;
        case 'edit':
            openModalAsEdit();
            break;
        default: throw new Error('No such mode')
    }
    modal.classList.add('active')
}

const modalH1 = document.getElementById('modal-h1');
window.openModalAsCreateProduct = function()
{
    modalH1.innerHTML = 'Add Product';
    common.setValuesOfSelector('.product-inputs', { name:"", description:"", category:""}, modal);
    // clear all fields, add isDefault=true variant 
    modalSubmit.onclick = createProduct;
}

function createProduct()
{
    // Gather productData
    // Gather VariantData
    // find copy isDefault to productData, remove the one in variantData
    // senddddddd
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
//#region Variant Modal Logic
const variantSelect = document.getElementById('variant-select');
const recordedVariants = [];
function setSelectedVariant(index)
{
    variantSelect.value = index;
    saveVariantChanges();
    common.setValuesOfSelector('.variant-inputs', modal, recordedVariants[index]);
}
variantSelect.addEventListener('change', function(){
    setSelectedVariant(variantSelect.value);
})

// remove variant but also save changes
function saveVariantChanges()
{
    const currentIndex = variantSelect.value;
    const updated = common.getAllNameValueOfSelector('.variant-inputs', variantSelect);
    variantSelect[currentIndex] = {...variantSelect[currentIndex], ...updated};
}

window.addNewVariant = function()
{
    const index = recordedVariants.push({
        id: recordedVariants.length,
        name: "",
        stock: 0
    })
    syncVariantOptions(recordedVariants, variantSelect);
    setSelectedVariant(index);
}
window.deleteCurrentVariant = function()
{
    const currentIndex = variantSelect.value;
    if(recordedVariants[currentIndex].isDefault) {
        alert('Cannot delete default variant')
        return;
    }
    recordedVariants.splice(currentIndex, 1);
}
function prepareModalToCreateVariant() {
    common.setValuesOfSelector('.variant-inputs', editProductVariantForm, {
        name: "",
        stock: 1
    });
    editingVariantId = null;
}
export function syncVariantOptions(Variants, selectElement) {
    selectElement.innerHTML = "";
    Variants.forEach((variant, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = variantData.name;
        option.selected = variant.isDefault;
        selectElement.appendChild(option);
    })
}
//#endregion
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

    includePreviousFiles(productImagesInput, uploaded)

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
    const editProductVariantModal = document.getElementById('edit-product-variant-modal');
    inputDetected = false;

    const productData = await product.fetchProduct(productId)
    setEditProduct(productData);

    // let defaultVariantId;
    // cachedVariants = {}
    // productData.Variants.forEach(Variant => {
    //     cachedVariants[Variant.id] = Variant
    //     if (Variant.isDefault) defaultVariantId = Variant.id;
    // })
    // generateSelectOptionsWithVariants(productData.Variants);
    // fillEditVariantFormWithCached(defaultVariantId);

    // editProductVariantModal.classList.add('active')
}
window.closeEditProductModal = function () {
    const editProductVariantModal = document.getElementById('edit-product-variant-modal');
    editProductVariantModal.classList.remove('active')
}
editProductVariantForm?.addEventListener('change', function () { inputDetected = true; })
editProductVariantForm?.addEventListener('submit', async function (event) {
    event.preventDefault()
    if (!inputDetected) {
        closeEditProductModal();
        return;
    }

    const productData = common.getAllNameValueOfSelector('.product-inputs', editProductVariantForm);
    common.convertAvailabilityKey(productData);
    const variantData = common.getAllNameValueOfSelector('.variant-inputs', editProductVariantForm);
    console.log(productData)
    console.log(variantData)
    try {
        const result = await product.editProduct(editingProductId, productData);
        if (editingVariantId) {
            await variant.editVariant(editingVariantId, variantData);
        } else {
            await variant.createVariant(editingProductId, variantData)
        }
        loadProducts()
    } catch (error) {
        console.error("Error updating product:", error)
        alert("Failed to update the product. Please try again.")
    }
    closeEditProductModal()
})

let editingProductId;
const editPreviewContainer = document.getElementById('edit-image-preview-container')
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