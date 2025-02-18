import { product, variant } from '../integration/fetches.js'
import common from '../common.js';

const editProductVariantForm = document.getElementById('edit-product-variant-form');
const productList = document.getElementById('product-list')
const productModal = document.getElementById('product-modal');

const productImages = document.getElementById('product-images');

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

//#region Add Product
window.openAddProductModal = function () {
    productModal.classList.add('active')
}
window.closeAddProductModal = function () {
    productModal.classList.remove('active')
}
document.addEventListener("click", event => {
    const modalContent = document.querySelector(".modal-form-container")
    if (modalContent.classList.contains("active") && !modalContent.contains(event.target)) {
        closeAddProductModal()
    }
})

function getProductImageFormData() {
    const formData = new FormData();
    for (let i = 0; i < productImages.files.length; i++) {
        formData.append('images', productImages.files[i]);
    }
    return formData;
}

// GARBVAGE

// ================= Image Handling =================
const dt = new DataTransfer();
const selectedFiles = []
const fileInput = document.getElementById("product-images");
let eventDueToUpdateFileInputUI = false;
fileInput.addEventListener("change", function () {
    if(eventDueToUpdateFileInputUI){
        eventDueToUpdateFileInputUI = false
        return;
    }
    const previewContainer = document.getElementById("image-preview-container");
    previewContainer.innerHTML = "";

    let uploaded = Array.from(fileInput.files);
    if (uploaded.length + selectedFiles.length > 4) {
        uploaded = uploaded.slice(0, 4-selectedFiles.length);
    }

    populateImagePreview(previewContainer, fileInput.files, function(toRemove){
        removeFromFileInput(fileInput, [toRemove]);
    });

    addToFileInput(fileInput, uploaded)
});

function populateImagePreview(previewContainer, files, removeImageHandler)
{
    Array.from(files).forEach( file => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const wrapper = document.createElement("div");
            wrapper.classList.add("image-preview-wrapper");

            const deleteElement = createDeleteElement(function(){
                removeImageHandler(file);
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

function addToFileInput(fileInput, toAdds) {
    const dt = new DataTransfer();
    Array.from(fileInput.files).forEach(file => dt.items.add(file));
    toAdds.forEach(file => dt.items.add(file));
    fileInput.files = dt.files;
    updateFileInputUI(fileInput);
}

function removeFromFileInput(fileInput, toRemoves) {
    const dt = new DataTransfer();
    Array.from(fileInput.files).forEach(file => {
        if (!toRemoves.includes(file)) {
            dt.items.add(file);
        }
    });
    fileInput.files = dt.files;
    updateFileInputUI(fileInput);
}

function updateFileInputUI(fileInput)
{
    fileInput.value = fileInput.files.length;
}

function createDeleteElement(onClickHandler)
{
    const deleteButton = document.createElement("span");
    deleteButton.classList.add("delete-icon");
    deleteButton.textContent = "×";
    deleteButton.addEventListener('click', onClickHandler);
    return deleteButton;
}

//#endregion

//#region Edit Product
let cachedVariants;
let inputDetected;

window.openEditProductModal = async function (productId) {
    const editProductVariantModal = document.getElementById('edit-product-variant-modal');
    inputDetected = false;

    const productData = await product.fetchProduct(productId)
    setEditProduct(productData);

    let defaultVariantId;
    cachedVariants = {}
    productData.Variants.forEach(Variant => {
        cachedVariants[Variant.id] = Variant
        if (Variant.isDefault) defaultVariantId = Variant.id;
    })
    generateSelectOptionsWithVariants(productData.Variants);
    fillEditVariantFormWithCached(defaultVariantId);

    editProductVariantModal.classList.add('active')
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

let editingVariantId;
function fillEditVariantFormWithCached(variantId) {
    const variantData = cachedVariants[variantId];
    editingVariantId = variantId;
    common.setValuesOfSelector('.variant-inputs', editProductVariantForm, variantData);
}

export function generateSelectOptionsWithVariants(Variants, selectElement) {
    selectElement.innerHTML = "";
    Variants.forEach(variant => {
        const option = document.createElement('option');
        option.value = variant.id;
        option.textContent = variant.name;
        option.selected = variant.isDefault;
        selectElement.appendChild(option);
    })
}

function prepareEditFormToCreateVariant() {
    common.setValuesOfSelector('.variant-inputs', editProductVariantForm, {
        name: "",
        stock: 1
    });
    editingVariantId = null;
}
//#endregion