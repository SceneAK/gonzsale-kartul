import {upload} from "../systems/index.js";

const pathFieldName = 'path';
function convertAllPathsToURLs(req, input)
{
    if(isArray(input))
    {
        input.forEach( element => {
            convertAllPathsToURLs(req, element);
        })
    }else if(isObject(input))
    {
        for(const key in input)
        {
            if(key === pathFieldName)
            {
                const relativePath = input[key];
                input['url'] = upload.buildAccessURL(req, relativePath);
                delete input[key];
            }else{
                convertAllPathsToURLs(req, input[key]);
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

export default convertAllPathsToURLs;