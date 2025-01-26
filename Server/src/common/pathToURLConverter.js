import { STATIC_ROUTE_NAME } from '../../initialize.js';

function buildURL(protocol, host, relativePath)
{
    return `${protocol}://${host}/${STATIC_ROUTE_NAME}/${relativePath}`;
}

const pathFieldName = 'path';
function convertAllPathsToURLs(protocol, host, input)
{
    if(isArray(input))
    {
        input.forEach( element => {
            convertAllPathsToURLs(protocol, host, element);
        })
    }else if(isObject(input))
    {
        for(const key in input)
        {
            if(key === pathFieldName)
            {
                input['url'] = buildURL(protocol, host, input[key]);
                delete input[key];
            }else{
                convertAllPathsToURLs(protocol, host, input[key]);
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

export {buildURL, convertAllPathsToURLs};