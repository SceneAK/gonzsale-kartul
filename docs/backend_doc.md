# Notable Things
The following will contain some notable logic, design decisions/quirks, and bugs of the backend node.js app alongside other potentially helpful information, since the developers have never created a fullstack system before this one. Things that are self explanitory / native to node.js will be skipped over.

## Setup
- Install all node dependencies + MySQL Service
- Run Node Server/setups/secretKey.js to generate a secret key in console
- Edit .env file to include SECRET_KEY, JWT_SECRET_KEY, PORT, MYSQL_URI
- Run syncDb to sync with mysql, provide URI with sufficient privileges

## Node.js
This site was made with Node.Js and Express simply because the first tutorial I found on making e-commerce websites was one with MERN stack. We didn't consider how pricey it is to run node.js compared to something like codeigniter, it was too late to switch.

## ReqSchemas
- JOI schema validation for incoming requests (yes, the entire request object)

## Database
### Sequelize
- Uses CLS namespace to make transactions easier
#### Issues with changing schema definitions
- I've encountered issues with imageId being duplicated for some unknown reason, causing the main catalog page not loading, which i've only noticed when making commit bdd350c6. It's unclear when the bug occurred, likely after underscored: true. Occurrs when two products exist, sequelize performs some sort of union all complicated mush
- I changed product_images table to have its own auto increment id and that seemed to fix the duplicate issue, but then it made queries that tried including ON `ProductImages`.`imageId` where imageId was not defined yet. solution was to add `imageId` to the attributes in .include() of productImages
- Adittionally, i've disabled separate=true and ordering since that caused long ass Union queries dependant on the product count
#### Do not use .get(), use toJSON() instead. 
    28 Jan 2025 GET /store's fetchStoreOfUser(uid) returns with model.get(). Calling this endpoint and then attempting to create product threw an error at Image.bulkCreate. GET /store returns the complete data, which means all is/should be resolved. The cause must be persistent across requests.
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
### multerUploads.js
- Server immediately stores uploaded files to __dir/public/${relativeFilePath}
- Access the files using {protocol}{host}/source/${relativeFilePath}
- Files are stored in the database as their relative path to the public directory, controllers are expect to transform them into URLs

## verifyAuthToken.js
- verify() authenticates signedCookies.token, then populates the *decodedAuthToken* in req, intended to be run before an operation requiring authentication, throwing an error if required = true

## Services
### Token Authentication
- *Some route controllers expects this middleware to run right before and depends on decodedAuthToken.id.*
- The normal checkAuthToken returns the ID or an error. Used for Logins and such
### User
- Schema's regex allows passwords and names to have chinese japanese characters, cause why the heck not?
#### User.FindOne literal where
- For some reason, one random time, User.findOne consistently ignores the where clause and returns the first row of the users table. Setting where { email: 'name@domain.com'} directly didn't even work. Only using where literals worked.

### Store
- As per the schema, storeData expects name, description, bankAccount, bankName. Files expects imageFile, qrImageFile.

### Move reqSchemas to middleware

## Delete files on rollback. 