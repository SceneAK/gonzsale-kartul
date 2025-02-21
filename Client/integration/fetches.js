const baseUrl = window.location.origin + '/api';

//#region Fetching
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
        throw new FetchError(`Request Fail, ${errorMessage}`, res);
    }
    return res;
}
async function jsonResponse(endpoint, method, body = null, credentials = 'omit', headers = {})
{
    const res = await request(endpoint, method, body, credentials, headers)
    const result = await res.json();
    return result;
}
async function jsonRequestResponse(endpoint, method, body = null, credentials = 'omit', headers = {})
{
    return await jsonResponse(endpoint, method, body, credentials, {'Content-Type': 'application/json', ...headers})
}
async function jsonRequest(endpoint, method, body = null, credentials = 'omit', headers = {})
{
    return await request(endpoint, method, body, credentials,{'Content-Type': 'application/json', ...headers});
}
const fetching = {request, jsonRequest, jsonResponse, jsonRequestResponse};

function isObject(value)
{
    return value && typeof value === 'object';
}
function isArray(value)
{
    return Array.isArray(value)
}
//#endregion

//#region Util
function toQueryString(obj)
{
    const queryParams = Object.keys(obj).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`).join("&");
    return queryParams;
}
//#endregion

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
    const result = await jsonRequestResponse('/user/signup', 'POST', body, 'include');
    return result;
}
async function editContacts(contacts) {
    return await jsonRequest('/user', 'PATCH', JSON.stringify(contacts), 'include');
}
async function refresh()
{
    return await jsonResponse('/user/refresh', 'POST', null, 'include');
}
async function expireCookie()
{
    return await request('/user/expire', 'POST', null, 'include');
}
const user = { signIn, signUp, editContacts, refresh, expireCookie } // both returns cookies
//#endregion

//#region Store
async function fetchStore(id)
{
    const store = await jsonRequestResponse(`/store/${id}`, "GET");
    return store;
}
async function fetchOwnedStore() {
    try {
        const store = await jsonRequestResponse(`/store`, "GET", null, 'include');
        return store;
    } catch (error) {
        if (error.status == 401) {
            return null; // Gracefully handle "No store owned" by returning null
        }
        throw error; // Re-throw other errors
    }
}

async function createStore(formdata) // auth
{
    await jsonResponse(`/store`, "POST", formdata, 'include');
    await user.refresh();
}
async function editStore(formdata)
{
    return await jsonResponse(`/store`, "PATCH", formdata);
}
const store = {fetchStore, fetchOwnedStore, createStore, editStore};
//#endregion

//#region Product
async function fetchProducts(category, others = {}, page = 1)
{
    const paramsObj = { category, ...others, page};
    const products = await jsonRequestResponse(`/product/search?${toQueryString(paramsObj)}`, "GET");
    return products;
}

async function fetchOwnedProducts(page = 1, filter={}) // auth
{
    const params = toQueryString({page, ...filter});
    return await jsonResponse(`/product/owned?${params}`, "GET", null, 'include'); 
}

async function fetchProduct(id)
{
    const product = await jsonRequestResponse(`/product/${id}`, "GET")
    return product;
}
async function createProduct(productData) // auth & store
{
    return await jsonRequestResponse(`/product`, "POST", JSON.stringify(productData), 'include');
}
async function createProductImages(productId, formData)
{
    return await jsonResponse(`/product/${productId}/images`, 'POST', formData, 'include');
}
async function editProduct(id, data) // auth & store
{
    return await jsonRequestResponse(`/product/${id}`, "PATCH", JSON.stringify(data), 'include');
}
async function deleteProductImage(imageId)
{
    return await jsonRequest(`/product/image/${imageId}`, 'DELETE', null, 'include');
}
async function deleteProduct(id)
{
    return await jsonRequest(`/product/${id}`, 'DELETE', null, 'include');
}
const product = {fetchProduct, fetchProducts, fetchOwnedProducts, createProduct, createProductImages, editProduct, deleteProduct, deleteProductImage};
//#endregion

//#region Variant
async function createVariants(productId, dataArr)
{
    return await jsonRequestResponse(`/product/${productId}/variants`, 'POST', JSON.stringify(dataArr), 'include');
}
async function editVariant(id, data)
{
    return await jsonRequestResponse(`/variant/${id}/edit`, 'PATCH', JSON.stringify(data), 'include');
}
async function deleteVariant(id)
{
    return await jsonRequestResponse(`/variant/${id}`, 'DELETE', null, 'include');
}
const variant = {createVariants, editVariant, deleteVariant}
//#endregion

//#region Order
async function fetchOrder(id) // auth
{
    return await jsonResponse(`/order/${id}`, "GET", null, 'include');
}
async function fetchMyOrders(page = 1) // auth
{
    return await jsonResponse(`/order/my?page=${page}`, "GET", null, 'include');
}
async function fetchIncomingOrders(page = 1, filter) // auth & store
{
    const params = toQueryString({ page, ...filter});
    return await jsonResponse(`/order/incoming?${params}`, "GET", null, 'include');
}
async function createOrder(data)// auth
{
    return await jsonRequestResponse('/order', "POST", JSON.stringify(data), 'include');   
}
async function updateItemStatus(id, status)
{
    return await jsonRequestResponse(`/order/item/${id}/status/${status}`, "PATCH", null, 'include');
}
async function updateItemStatusWhere(where, status)
{
    const query = toQueryString(where);
    return await jsonRequestResponse(`/order/item/by-product/status/${status}?${query}`, "PATCH", null, 'include');
}
const order = {fetchOrder, fetchMyOrders, fetchIncomingOrders, createOrder, updateItemStatus, updateItemStatusWhere};
//#endregion

//#region Transaction
async function fetchTransaction(id) // auth
{
    return await jsonResponse(`/transaction/${id}`, "GET", null, 'include');
}

async function createProofTransaction(orderId, formdata) // auth
{
    return await jsonResponse(`/transaction/${orderId}/proof`, "POST", formdata, 'include');
}

async function createCODTransaction(orderId, data) // auth
{
    return await jsonResponse(`/transaction/${orderId}/cod`, "POST", JSON.stringify(data), 'include');
}

const transaction = {fetchTransaction, createProofTransaction, createCODTransaction};
//#endregion

export {
    fetching,
    user,
    store,
    product,
    order,
    transaction,
    variant
}


class FetchError extends Error {
    constructor(message, response) {
        super(message);
        this.name = 'FetchError';
        this.status = response.status;
        this.statusText = response.statusText;
        this.url = response.url;
    }
}
  
