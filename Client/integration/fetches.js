const baseUrl = "http://localhost:3000";
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
    try
    {
        return req.json();
    }catch(err) {throw err;}
}
async function formdataRequest(endpoint, method, formdata = null, credentials = 'omit', headers = {})
{
    return await jsonRequest(endpoint, method, formdata, credentials, {'Content-Type': 'multipart/form-data', ...headers})
}

//#region User
async function signIn(email, password) {
    const body = JSON.stringify({user_email: email, user_password: password});
    try
    { // temporary
        return await jsonRequest('/user/signin', 'POST', body)
    }catch(err){ return {user_name: "TEMP", user_role: "STORE_MANAGER"}}
}
async function signUp(name, phone, email, password) { 
    const body = JSON.stringify({
        user_name: name,
        user_phone: phone,
        user_email: email, 
        user_password: password
    });
    const res = await jsonRequest('/user/signup', 'POST', body);
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
async function getProducts(category, extraFilters)
{
    const products = await jsonRequest(`/product/${category}`, "GET", extraFilters); 
    // REMOVE ON PRODUCTION
    return products.map( product => { 
        
        product.product_imgSrc = product.product_imgSrc.map( src => {
            const insertIndex = src.indexOf("localhost") + 9;
            return src.slice(0, insertIndex) + ":3000" + src.slice(insertIndex);
        }); 
        return product;
    })
}
async function getProduct(id)
{
    return (await jsonRequest(`/product/single/${id}`, "GET"))[0];
}
async function createProduct(formdata) // auth & store
{
    return await formdataRequest(`/product`, "POST", formdata, 'include');
}
async function editProduct(formdata, id) // auth & store
{
    return await formdataRequest(`/product/${id}`, "PATCH", formdata, 'include');
}
const product = {getProduct, getProducts, createProduct, editProduct};
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