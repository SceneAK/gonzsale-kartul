import { product } from "../integration/fetches.js";

const productImagesInput = document.getElementById("product-images");
const previewContainer = document.getElementById("image-preview-container");
productImagesInput.addEventListener("change", function (event) {
    event.preventDefault();
    previewContainer.innerHTML = "";
    
    includePreviousFiles(productImagesInput)
    populateImagePreview();
});

let existingProductImages = []; 
export function setExistingProductImages(productImages)
{
    if(productImages.length > 0){
        existingProductImages = productImages;
        populateImagePreview();
        productImagesInput.required = false;
    }
}
function populateImagePreview()
{
    previewContainer.innerHTML = "";
    populateWithExistingImagePreview(previewContainer, existingProductImages);
    populateWithFilesPreview(previewContainer, productImagesInput.files, function(fileToRemove, index){
        removeFromFileInput(productImagesInput, fileToRemove);
    });
}
let imageIdstoBeDeleted = [];
export async function deleteDeletedPreviewImages()
{
    for(const imageId of imageIdstoBeDeleted){
        await product.deleteProductImage(imageId)
    }
}
function populateWithExistingImagePreview(container, existingProductImages = [])
{
    existingProductImages.forEach( (productImage, index) => {
        const imgPreview = addImagePreview(productImage.url, function(src){
            imageIdstoBeDeleted.push(productImage.imageId);
            removeFromExistingImages(index);
        });
        container.appendChild(imgPreview);
    })
}
function populateWithFilesPreview(container, files, removeImageHandler)
{
    Array.from(files).forEach( (file, index)=> {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgPreview = addImagePreview(e.target.result, function(){
                removeImageHandler(file, index);
            });
            container.appendChild(imgPreview);
        };
        reader.readAsDataURL(file);
    });
}
function addImagePreview(src, deleteHandler)
{
    const wrapper = document.createElement("div");
    wrapper.classList.add("image-preview-wrapper");

    const deleteElement = createDeleteElement(function(){
        deleteHandler(src);
        previewContainer.removeChild(wrapper);
    });
    wrapper.appendChild(deleteElement);

    const img = document.createElement("img");
    img.src = src;
    img.classList.add("image-preview");
    wrapper.appendChild(img);
    return wrapper;
}

const previousDt = new DataTransfer();
export function resetProductImages()
{
    previewContainer.innerHTML = "";
    previousDt.items.clear();
    existingProductImages = [];
    imageIdstoBeDeleted = [];
    productImagesInput.required = true;
    productImagesInput.files = previousDt.files;
}
function includePreviousFiles(fileInput) {
    const previousArr = Array.from(previousDt.files);
    let newArr = Array.from(fileInput.files);

    if(previousArr.length + newArr.length > 4){
        const spaceLeft = (4 - previousArr.length);
        newArr = newArr.splice(0, spaceLeft);
    }

    newArr.forEach( file => {
        if(!previousArr.includes(file)) previousDt.items.add(file)
    })
    fileInput.files = previousDt.files;
}

function removeFromFileInput(fileInput, fileToRemove) {
    const index = Array.from(previousDt.files).indexOf(fileToRemove);
    previousDt.items.remove(index);
    fileInput.files = previousDt.files; 
}
function removeFromExistingImages(index)
{
    existingProductImages.splice(index, 1);
}

function createDeleteElement(onClickHandler)
{
    const deleteButton = document.createElement("span");
    deleteButton.classList.add("delete-icon");
    deleteButton.textContent = "×";
    deleteButton.onclick = onClickHandler;
    return deleteButton;
}
export function getProductImageFormData() {
    const formData = new FormData();
    for (let i = 0; i < productImagesInput.files.length; i++) {
        formData.append('images', productImagesInput.files[i]);
    }
    return formData;
}
