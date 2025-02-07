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
        throw new Error(`Request failed: ${errorMessage}`);
    }
    return res;
}
async function jsonResponse(endpoint, method, body = null, credentials = 'omit', headers = {})
{
    const res = await request(endpoint, method, body, credentials, headers)
    const result = await res.json();
    tryIncludePortAll(result)
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

//#region temporary
function tryIncludePortAll(input, port = '3000')
{
    if(isArray(input))
    {
        input.forEach( element => {
            tryIncludePortAll(element, port);
        })
    }else if(isObject(input))
    {
        for(const key in input)
        {
            if(key === 'url')
            {
                const insertIndex = input[key].indexOf("localhost") + 9;
                input[key] = input[key].slice(0, insertIndex) + ":3000" + input[key].slice(insertIndex);
            }else{
                tryIncludePortAll(input[key], port)
            }
        }
    }
}
function isObject(value)
{
    return value && typeof value === 'object';
}
function isArray(value)
{
    return Array.isArray(value)
}
//#endregion
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
    return await jsonRequestResponse('/user/signup', 'POST', body, 'include');
}
async function editContacts(contacts) {
    return await jsonRequest('/user/edit', 'PATCH', JSON.stringify(contacts), 'include');
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
async function fetchProducts(category, others = {}, page = 1)
{
    const paramsObj = { category, ...others};
    const products = await jsonRequestResponse(`/product/search?page=${page}&${toQueryString(paramsObj)}`, "GET");
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
    const product = await jsonRequestResponse(`/product/${id}`, "GET")
    return product;
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
async function fetchOrder(id) // auth
{
    return await jsonResponse(`/order/${id}`, "GET", null, 'include');
}
async function fetchMyOrders(page = 1) // auth
{
    return await jsonResponse(`/order/my?page=${page}`, "GET", null, 'include');
}
async function fetchIncomingOrders(page = 1) // auth & store
{
    return await jsonResponse(`/order/incoming?page=${page}`, "GET", null, 'include');
}
async function createOrder(data)// auth
{
    return await jsonRequestResponse('/order', "POST", JSON.stringify(data), 'include');   
}
async function updateItemStatus(id, status)
{
    return await jsonRequestResponse(`/order/item/${id}/status`, "PATCH", JSON.stringify({status}), 'include');
}
async function updateItemStatusByProduct(id, status)
{
    return await jsonRequestResponse(`/order/item/by-product/${id}/status`, "PATCH", JSON.stringify({status}), 'include');
}
const order = {fetchOrder, fetchMyOrders, fetchIncomingOrders, createOrder, updateItemStatus, updateItemStatusByProduct};
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
    transaction
}