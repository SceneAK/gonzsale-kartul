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
    return await jsonRequestResponse('/user/signup', 'POST', body, 'include');
}
const user = { signIn, signUp } // both returns cookies
//#endregion

//#region Store
async function fetchStore(id)
{
    const store = await jsonRequestResponse(`/store/${id}`, "GET");
    store.image = transformUrl(store.image.url);
    return store;
}
async function fetchOwnedStore() {
    try {
        const store = await jsonRequestResponse(`/store`, "GET", null, 'include');
        store.image.url = transformUrl(store.image?.url);
        console.log(store);
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
async function fetchOrder(id) // auth
{
    return await jsonResponse(`/order/${id}`, "GET", null, 'include');
}
async function fetchMyOrders() // auth
{
    return await jsonResponse('/order/my', "GET", null, 'include');
}
async function fetchIncomingOrders() // auth & store
{
    return await jsonResponse('/order/incoming', "GET", null, 'include');
}
async function createOrder(data)// auth
{
    return await jsonRequestResponse('/order', "POST", JSON.stringify(data), 'include');   
}
async function updateItemStatus(id, status)
{
    return await jsonResponse(`/order/item/${id}/status`, "PATCH", JSON.stringify({status}), 'include');
}
async function updateItemStatusByProduct(id, status)
{
    return await jsonResponse(`/order/item/by-product/${id}/status`, "PATCH", JSON.stringify({status}), 'include');
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
    user,
    store,
    product,
    order,
    transaction
}