const baseUrl = "http://localhost:3000/api";

async function request(endpoint, method, body = null, credentials = 'omit', headers = {})
{
    const res = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers,
        credentials,
        body
    });
    if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`Request failed: ${errorMessage}`);
    }
    return res;
}
async function jsonResponse(endpoint, method, body = null, credentials = 'omit', headers = {})
{
    const req = await request(endpoint, method, body, credentials,headers)
    return req.json();
}
async function jsonRequestResponse(endpoint, method, body = null, credentials = 'omit', headers = {})
{
    return await jsonResponse(endpoint, method, body, credentials, {'Content-Type': 'application/json', ...headers})
}
//#region User
async function signIn(email, password) {
    const body = JSON.stringify({email, password});
    return await jsonRequestResponse('/user/signin', 'POST', body, 'include')
}
async function signUp(name, phone, email, password) { 
    const body = JSON.stringify({
        name,
        phone,
        email, 
        password
    });
    const res = await jsonRequestResponse('/user/signup', 'POST', body, 'include');
    return await res.text();
}
const user = { signIn, signUp } // both returns cookies
//#endregion

//#region Store
async function fetchStore(id)
{
    return await jsonRequestResponse(`/store/${id}`, "GET");
}
async function fetchOwnedStore() {
    try {
        return await jsonRequestResponse(`/store`, "GET", null, 'include');
    } catch (error) {
        if (error.message.includes("No store owned")) {
            return null; // Gracefully handle "No store owned" by returning null
        }
        throw error; // Re-throw other errors
    }
}

async function createStore(formdata) // auth
{
    return await jsonResponse(`/store`, "POST", formdata, 'include');
}
async function editStore(formdata)
{
    return await jsonResponse(`/store`, "PATCH", formdata);
}
const store = {fetchStore, fetchOwnedStore, createStore, editStore};
//#endregion

//#region Product
async function fetchProducts(category, others = {})
{
    const paramsObj = { category, ...others};
    const products = await jsonRequestResponse(`/product/search?${toQueryString(paramsObj)}`, "GET"); 
    products.forEach( product => transformProductImagesUrls(product)) ;
    return products;
}
function toQueryString(obj)
{
    const queryParams = Object.keys(obj).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`).join("&");
    return queryParams;
}

async function fetchOwnedProducts() // auth
{
    return await jsonResponse(`/product/owned`, "GET", null, 'include'); 
}

async function fetchProduct(id)
{
    const product = await jsonRequestResponse(`/product/single/${id}`, "GET")
    transformProductImagesUrls(product);
    return product;
}
function transformProductImagesUrls(product)
{
    for (let i = 0; i < product.ProductImages.length; i++) {
        product.ProductImages[i].url = transformUrl(product.ProductImages[i].url);
    }
}
function transformUrl(str)
{
    const insertIndex = str.indexOf("localhost") + 9;
    return str.slice(0, insertIndex) + ":3000" + str.slice(insertIndex);
}
async function createProduct(formdata) // auth & store
{
    return await jsonResponse(`/product`, "POST", formdata, 'include');
}
async function editProduct(formdata, id) // auth & store
{
    return await jsonResponse(`/product/${id}`, "PATCH", formdata, 'include');
}
const product = {fetchProduct, fetchProducts, fetchOwnedProducts, createProduct, editProduct};
//#endregion

//#region Order
async function fetchOrders() // auth
{
    return await jsonResponse('/order', "GET", null, 'include');
}
async function fetchIncomingOrders() // auth & store
{
    return await jsonResponse('/order/incoming', "GET", null, 'include');
}
async function placeOrder(formdata)// auth
{
    return await jsonResponse('/order', "POST", formdata, 'include');   
}
async function placeOrderGuest(formdata)
{
    return await jsonResponse('/order/guest', "POST", formdata);
}
const order = {fetchOrders, fetchIncomingOrders, placeOrder, placeOrderGuest};
//#endregion


export {
    user,
    store,
    product,
    order
}