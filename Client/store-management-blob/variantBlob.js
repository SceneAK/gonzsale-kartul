import { variant } from "../integration/fetches.js";
import common from "../common.js";

const modal = document.getElementById('product-variant-modal');
const variantSelect = document.getElementById('variant-select');
let recordedVariants = [];
let currentIndex;
export function saveAndCloneRecordedVariants(){
    saveVariantChanges();
    return Array.from(recordedVariants);
}

function setSelectedVariant(index)
{
    syncVariantOptions(recordedVariants, variantSelect);

    currentIndex = index;
    variantSelect.value = index;

    common.setValuesOfSelector('.variant-inputs', modal, recordedVariants[index]);
}
function saveVariantChanges()
{
    const updated = common.getAllNameValueOfSelector('.variant-inputs', modal);
    recordedVariants[currentIndex] = {...recordedVariants[currentIndex], ...updated};
}
function addNewVariant(data)
{
    const newLen = recordedVariants.push(data)
    saveVariantChanges();
    setSelectedVariant(newLen - 1);
}


export function resetRecordedVariants(firstVariantData){
    counter = 0;;
    recordedVariants = [];
    addNewVariant(firstVariantData);
}
variantSelect.addEventListener('change', function(){
    saveVariantChanges();
    setSelectedVariant(variantSelect.value);
})
document.getElementById('variant-name').onblur = ()=>{
    saveVariantChanges();
    setSelectedVariant(currentIndex);
};

// remove variant but also save changes

let counter = 0;
window.addNewVariant = function()
{
    counter += 1;
    addNewVariant({
        name: `Variant ${counter}`,
        stock: 0
    })
}

window.deleteCurrentVariant = function()
{
    if(recordedVariants[currentIndex].isDefault) {
        alert('Cannot delete default variant')
        return;
    }
    recordedVariants.splice(currentIndex, 1);
    setSelectedVariant( Math.max(currentIndex - 1, 0) );
}

export function syncVariantOptions(Variants, selectElement) {
    selectElement.innerHTML = "";
    Variants.forEach((variant, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = variant.name;
        option.selected = variant.isDefault;
        selectElement.appendChild(option);
    })
}
