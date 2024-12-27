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
### User
- Users with NULL passwords are considered guest users. They are users who have put their email for an order, but have yet to register.
### Product

### Order

### Token Authentication
- *Some route controllers expects this middleware to run right before and depends on decodedAuthToken.id.*
- The normal checkAuthToken returns the ID or an error. Used for Logins and such
### User
**- Not expicit, but userServices returns signed tokens upon signin/singup. Other services expect this token decoded in req.decodedAuthToken by the verify() middleware**
- Schema's regex allows passwords and names to have chinese japanese characters, why the heck not?
### Store
- As per the schema, storeData expects name, description, bankAccount, bankName. Files expects imageFile, qrImageFile.

### Move reqSchemas to middleware