I assume AI will be advanced enough where it can interpret this mess of a codebase reliably, since this isn't really a documentation. I apologize in advance for how unscalable and coupled some systems are. Most libraries were chosen without consideration, we have never created a fullstack system before this one. Contact me to get the google project access if needed.

# Setup
1. $ npm install dependencies
2. Install MySQL Service, run it, and set up a user for this app.
3. Add a .env file (or inject it). Follow Server/.env.template
    - You can run Server/setups/secretKey.js to help generate a secret key 
4. Run syncDb to sync with mysql (or if you're up for it, try to fix the initial migration script). Ensure the mysql user in .env has sufficient privileges for this


# Frontend
I, the person writing this document, did not design the frontend. I had to go through to pain of integration all by myself. 
One notable page is store-management, which was such a monolithic file, I had to split them into "blobs". They aren't by any means clean, it was a quick refactor. Notice _config.js.

# Backend
- ReqSchemas
    JOI schema validation for incoming requests, the entire request object.
- Database
    CLS namespace is also used to make transactions easier.
    Uses Sequelize-CLI & Umzug for database migrations
    The reason why EnvEditor.js and Wipe.js exist is related to how we had no access to "our" server besides lazy pulling.
- UserStorage
    This overcomplicates things.
- SSR
    We didn't do SSR from the start due to lack of skill. I decided to add SSR to one page so we can make use of OpenGraph.
- Upload
    We have the option to switch to GCS because we thought our hosting only has ephemeral storage.
- Check task_backlog to check my wishful thinking.

# Bugs
## Transitioning to underscored model names
- I've encountered issues with imageId being duplicated for some unknown reason, causing the main catalog page not loading, which i've only noticed when making commit bdd350c6. It's unclear when the bug occurred, likely after underscored: true. Occurrs when two products exist, sequelize performs some sort of union all complicated mush
- I changed product_images table to have its own auto increment id and that seemed to fix the duplicate issue, but then it made queries that tried including ON `ProductImages`.`imageId` where imageId was not defined yet. solution was to add `imageId` to the attributes in .include() of productImages
- Adittionally, i've disabled separate=true and ordering since that caused long ass Union queries dependant on the product count
## Weird inter-request persistent bug
Do not use .get(). use toJSON() instead. 
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
## User.FindOne literal where
- For some reason, one random time, User.findOne consistently ignores the where clause and returns the first row of the users table. Setting where { email: 'name@domain.com'} directly didn't even work. Only using where literals worked.
