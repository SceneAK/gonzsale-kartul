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
    const result = await jsonResponse(endpoint, method, body, credentials, {'Content-Type': 'application/json', ...headers});
    return result;
}
async function jsonRequest(endpoint, method, body = null, credentials = 'omit', headers = {})
{
    return await request(endpoint, method, body, credentials,{'Content-Type': 'application/json', ...headers});
}
const fetching = {request, jsonRequest, jsonResponse, jsonRequestResponse};
//#endregion

//#region Util
function toQueryString(obj)
{
    const queryParams = Object.keys(obj).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`).join("&");
    return queryParams;
}

//#endregion

//#region User
async function fetchUsers(params){
    const query = toQueryString(params);
    return await jsonResponse(`/user?${query}`, 'GET', null, 'include')
}
async function signIn(email, password) {
    const body = JSON.stringify({email, password});
    return await jsonRequestResponse('/user/signin', 'POST', body, 'include')
}
async function signUp(name, phone, email, password, recaptchaResponse) { 
    const body = JSON.stringify({
        name,
        phone,
        email, 
        password,
        'g-recaptcha-response': recaptchaResponse
    });
    const result = await jsonRequestResponse('/user/signup', 'POST', body, 'include');
    return result;
}
async function editContacts(userId, contacts) {
    return await jsonRequest(`/user/${userId}`, 'PATCH', JSON.stringify(contacts), 'include');
}
async function refresh()
{
    return await jsonResponse('/user/refresh', 'POST', null, 'include');
}
async function expireCookie()
{
    return await request('/user/expire', 'POST', null, 'include');
}
async function grantRole(userId, role)
{
    return await request(`/user/${userId}/${role}`, 'PATCH', null, 'include');
}
const user = {fetchUsers, signIn, signUp, editContacts, refresh, expireCookie, grantRole} // both returns cookies
//#endregion

//#region Store
async function fetchStore(id)
{
    const store = await jsonRequestResponse(`/store/${id}`, "GET", null, 'include');
    return store;
}
async function fetchStores()
{
    const stores = await jsonResponse('/store/all', "GET");
    return stores;
}

async function fetchStoreAnalytics(storeId, startDate, endDate){
    const query = toQueryString({startDate, endDate})
    return await jsonRequestResponse(`/store/${storeId}/analytics?${query}`, "GET", null, 'include');
}

async function createStore(data) // auth
{
    await jsonRequestResponse(`/store`, "POST", JSON.stringify(data), 'include');
}
async function editStore(storeId, data)
{
    return await jsonRequestResponse(`/store/${storeId}`, "PATCH", JSON.stringify(data), 'include');
}
async function updateStoreImage(storeId, image)
{
    const formData = new FormData();
    formData.append('image', image);
    return await jsonResponse(`/store/${storeId}/image`, "PATCH", formData, 'include');
}
const store = {fetchStore, fetchStores, fetchStoreAnalytics, createStore, editStore, updateStoreImage};
//#endregion

//#region Product
async function fetchProducts(category, page = 1, others = {})
{
    const paramsObj = { category, ...others, page};
    const products = await jsonRequestResponse(`/product/search?${toQueryString(paramsObj)}`, "GET");
    return products;
}

async function fetchProductsOfStore(storeId, page = 1, filter={}) // auth
{
    const params = toQueryString({page, ...filter});
    return await jsonResponse(`/product/store/${storeId}?${params}`, "GET", null, 'include'); 
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
async function createProductImages(productId, files)
{
    const formData = new FormData();
    Array.from(files).forEach( file => formData.append('images', file));
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
const product = {fetchProduct, fetchProducts, fetchProductsOfStore, createProduct, createProductImages, editProduct, deleteProduct, deleteProductImage};
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
    return await jsonRequestResponse(`/order/${id}`, "GET", null, 'include');
}
async function fetchOrdersOfUser(userId, page = 1) // auth
{
    return await jsonRequestResponse(`/order/user/${userId}?page=${page}`, "GET", null, 'include');
}
async function fetchOrdersForStore(storeId, page = 1, filter = {}) // auth & store
{
    const params = toQueryString({ page, ...filter});
    const response = await jsonRequestResponse(`/order/store/${storeId}?${params}`, "GET", null, 'include');
    return response;
}
async function createOrders(data, recaptchaResponse) // auth
{
    return await jsonRequestResponse('/order', "POST", JSON.stringify({...data, 'g-recaptcha-response': recaptchaResponse}), 'include');   
}
async function updateItemStatus(id, status)
{
    return await jsonRequestResponse(`/order/item/${id}/status/${status}`, "PATCH", null, 'include');
}
async function updateItemStatusWhere(where, status)
{
    const query = toQueryString(where);
    return await jsonRequestResponse(`/order/item/status/${status}?${query}`, "PATCH", null, 'include');
}
const order = {fetchOrder, fetchOrdersForStore, fetchOrdersOfUser, createOrders, updateItemStatus, updateItemStatusWhere};
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
  
