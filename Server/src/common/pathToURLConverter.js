import { STATIC_ROUTE_NAME } from '../../initialize.js';

function buildURL(protocol, host, relativePath)
{
    return `${protocol}://${host}/${STATIC_ROUTE_NAME}/${relativePath}`;
}

const pathFieldName = 'path';
function convertAllPathsToURLs(protocol, host, obj)
{
    for(const key in obj)
    {
        if(isPlainObject(obj[key]))
        {
            convertAllPathsToURLs(protocol, host, obj[key]);
        }
        else if(key === pathFieldName)
        {
            obj['url'] = buildURL(protocol, host, obj[key]);
            delete obj[key];
        }
    }
}

function isPlainObject(value)
{
    const isArray = Array.isArray(value);
    const isObject = value && typeof value === 'object';
    return !isArray && isObject;
}

export {buildURL, convertAllPathsToURLs};