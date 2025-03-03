function buildData(selector, parentElement = document)
{
    const elements = Array.from(parentElement.querySelectorAll(selector));
    return elements.reduce( (accumulator, element) => {
        accumulator[element.name] = element.value;
        return accumulator;
    }, {})
}
function populateWithData(selector, obj, parentElement = document)
{
    const elements = Array.from(parentElement.querySelectorAll(selector));
    elements.forEach( element => {;
        const value = obj[element.name]
        element.value = value !== undefined ? value : element.value;
    })
}
function modifyData(data, adjustments)
{
    const { set, remove } = adjustments;
    for(const keyToChange in set)
    {
        data[keyToChange] = set[keyToChange];
    }
    for(const keyToRemove of remove)
    {
        delete data[keyToRemove];
    }
    return data;
}
const elementUtils = { buildData, populateWithData, modifyData }

function buildCartItem(product, selectedVariant, quantity)
{
    return { 
        product, 
        selectedVariant, 
        quantity
    };
}
class InputDebouncer {
    static listen(inputElement, callback, enterIncluded = false, delay = 700)
    {
        let idleTimer;
        inputElement.addEventListener('keydown', function(event){
            clearTimeout(idleTimer);
            if(event.key == 'Enter' && enterIncluded){
                callback?.(event);
            }
        });
        inputElement.addEventListener('keyup', function(event){
            clearTimeout(idleTimer);
            idleTimer = setTimeout(function(){
                callback?.(event);
            }, delay)
        })
    }
}

export default {
    elementUtils,
    buildCartItem,
    InputDebouncer
}