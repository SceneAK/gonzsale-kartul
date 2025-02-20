function getAllNameValueOfSelector(selector, parentElement)
{
    const inputElements = Array.from(parentElement.querySelectorAll(selector));
    return inputElements.reduce( (accumulator, element) => {
        accumulator[element.name] = element.value;
        return accumulator;
    }, {})
}
function convertAvailabilityKey(obj)
{
    for(const key in obj)
    {
        if(key == 'availability') {
            obj['isAvailable'] = obj[key] == 'available';
            delete obj[key];
        }
    }
}
function setValuesOfSelector(selector, parentElement, obj)
{
    const inputElements = Array.from(parentElement.querySelectorAll(selector));
    inputElements.forEach( element => {;
        const value = obj[element.name]
        element.value = value !== undefined ? value : element.value;
    })
}
function setAvailabilityElementValue(element, value)
{
    element.value = value ? 'available' : 'unavailable';
}
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
    getAllNameValueOfSelector, 
    setValuesOfSelector, 
    setAvailabilityElementValue, 
    convertAvailabilityKey,
    buildCartItem,
    InputDebouncer
}