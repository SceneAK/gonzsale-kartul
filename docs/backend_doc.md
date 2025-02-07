# Notable Things
The following will contain some notable logic, design decisions/quirks, and bugs of the backend app alongside other potentially helpful information. Things that are self explanitory / native to node.js will be omitted.
## Setup
- Install all node dependencies + MySQL Service
- Edit .env file to include SECRET_KEY, JWT_SECRET_KEY, PORT, MYSQL_URI
- Run Node Server/setups/secretKey.js to generate a secret key in console

## ReqSchemas
- JOI schema validation for incoming requests (yes, the entire request object)

## Database
### Sequelize
- Uses CLS namespace to make transactions not a hassle
#### IMPORTANT: Do not use .get(), use toJSON() instead. 
    28 Jan 2025 GET /store's fetchStoreOfUser(uid) returns with model.get(). Calling this endpoint and then attempting to create product threw an error at Image.bulkCreate. GET /store returns the complete data, which means all is/should be resolved. Cause must be persistent across requests.
    What I've ruled out: 
        - Transactions: I've removed them, error persists
        - CLS Namespaces: I've removed them, error persists
        - fetchStoreOfUser(uid): I've tried calling it first line in createProducts, didn't throw error. I've tried calling createProducts twice, didn't throw error. Only when calling fetchStoreOfUser from GET /store, it threw the error.
        - Caching: No global variables related to stores are used in the code i've written.
        - Faulty Data: I've console.log-ed the imageDatas passed to bulkCreate, it's the same with or without calling GET /store. 
    Suspicions: 
        - Sequelize lazy loading (doubt). I don't fully understand it, how it's connected to createProducts, but chatGPT keeps pointing to it. Something about the model not resolving when using .get() through GET /store, but does resolve when calling the function directly. And somehow (???) this unresolved model "indirectly impacts" Image.bulkCreate.
        - Linked with specifically Image Creation: I haven't checked, but perhaps it's just image creation. I tried calling GET /store and then POST /signup, that worked just fine. Haven't tried anything else though.

## Middlewares
## schemaValidator.js
- validator itterates through these keys and validates the corresponding req keys' values use coersion to force convert types. Expect Formdata strings to be converted (except for objects)
## multerUploads.js
- Server immediately stores uploaded files to __dir/public/${relativeFilePath}
- Access the files using gonzsale.com/source/${relativeFilePath}
- Files are stored in the database as their relative path to the public directory: Controllers must buildUrl() from the relative path when sending them back to the client.
## verifyAuthToken.js
- verify() authenticates signedCookies.token, then fills the *decodedAuthToken* in req, intended to be run before an operation requiring authentication, throwing an error otherwise

## Services
### Product

### Order

### Token Authentication
- *Some route controllers expects this middleware to run right before and depends on decodedAuthToken.id.*
- The normal checkAuthToken returns the ID or an error. Used for Logins and such
### User
**- Not expicit, but userServices returns signed tokens upon signin/singup. Other services expect this token decoded in req.decodedAuthToken by the verify() middleware**
- Schema's regex allows passwords and names to have chinese japanese characters, cause why the heck not?
### Store
- As per the schema, storeData expects name, description, bankAccount, bankName. Files expects imageFile, qrImageFile.

### Move reqSchemas to middleware

## Delete files on rollback. 