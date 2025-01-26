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
async function jsonRequest(endpoint, method, body = null, credentials = 'omit', headers = {})
{
    const req = await request(endpoint, method, body, credentials, {'Content-Type': 'application/json', ...headers})
    return req.json();
}
async function formdataRequest(endpoint, method, formdata = null, credentials = 'omit', headers = {})
{
    return await jsonRequest(endpoint, method, formdata, credentials, {'Content-Type': 'multipart/form-data', ...headers})
}
//#region User
async function signIn(email, password) {
    const body = JSON.stringify({email, password});
    return await jsonRequest('/user/signin', 'POST', body, 'include')
}
async function signUp(name, phone, email, password) { 
    const body = JSON.stringify({
        name,
        phone,
        email, 
        password
    });
    const res = await jsonRequest('/user/signup', 'POST', body, 'include');
    return await res.text();
}
const user = { signIn, signUp } // both returns cookies
//#endregion

//#region Store
async function getStore(id)
{
    return await jsonRequest(`/store/${id}`, "GET");
}
async function getOwnStore()
{
    return await jsonRequest(`/store`, "GET", null, 'include');
}
async function createStore(formdata) // auth
{
    return await formdataRequest(`/store`, "POST", formdata, 'include');
}
async function editStore(formdata)
{
    return await formdataRequest(`/store`, "PATCH", formdata);
}
const store = {getStore, getOwnStore, createStore, editStore};
//#endregion

//#region Product
async function fetchProducts(category, others = {})
{
    const paramsObj = { category, ...others};
    const products = await jsonRequest(`/product/search?${toQueryString(paramsObj)}`, "GET"); 
    products.forEach( product => transformProductImagesUrls(product)) ;
    return products;
}
function toQueryString(obj)
{
    const queryParams = Object.keys(obj).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`).join("&");
    return queryParams;
}

async function fetchProduct(id)
{
    const product = await jsonRequest(`/product/single/${id}`, "GET")
    transformProductImagesUrls(product);
    return product;
}
function transformProductImagesUrls(product)
{
    console.log(product);
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
    return await formdataRequest(`/product`, "POST", formdata, 'include');
}
async function editProduct(formdata, id) // auth & store
{
    return await formdataRequest(`/product/${id}`, "PATCH", formdata, 'include');
}
const product = {fetchProduct, fetchProducts, createProduct, editProduct};
//#endregion

//#region Order
async function getOrders() // auth
{
    return await jsonRequest('/order', "GET", null, 'include');
}
async function getIncomingOrders() // auth & store
{
    return await jsonRequest('/order/incoming', "GET", null, 'include');
}
async function placeOrder(formdata)// auth
{
    return await formdataRequest('/order', "POST", formdata, 'include');   
}
async function placeOrderGuest(formdata)
{
    return await formdataRequest('/order/guest', "POST", formdata);
}
const order = {getOrders, getIncomingOrders, placeOrder, placeOrderGuest};
//#endregion


export {
    user,
    store,
    product,
    order
}