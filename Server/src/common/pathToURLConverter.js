import { STATIC_ROUTE_NAME } from '../../initialize.js';

function buildURL(protocol, host, relativePath)
{
    return `${protocol}://${host}/${STATIC_ROUTE_NAME}/${relativePath}`;
}

const imageModelPathFieldName = 'path';
function convertAllImagePathsToURLs(protocol, host, obj)
{
    for(const key in obj)
    {
        const isObject = obj[key] instanceof Object;
        const isArray = Array.isArray(obj[key]);
        if(isObject && !isArray)
            {
            convertAllImagePathsToURLs(protocol, host, obj[key]);
        }
        else if(key === imageModelPathFieldName)
        {
            obj[key] = buildURL(protocol, host, obj[key]);
        }
    }
}

export {buildURL, convertAllImagePathsToURLs};