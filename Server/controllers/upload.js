let connection;
(async () => { 
    connection = await require("../modules/db")
})()

const staticRouteName = '/source/';
const imagePath = path.join(__dirname, ' public/images');

const uploadImage = async (req, res) =>
{
    // need to track how much users are uploading. 
}


module.exports = {
    staticRouteName,
    imagePath
}

