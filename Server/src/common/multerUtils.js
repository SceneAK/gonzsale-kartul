export function getFilesIfAny(req)
{
    const { file, files } = req;
    if(file)
    {
        return [file];
    }
    if(files)
    {
        if(!Array.isArray(files)){
            const files2D = Object.values(files);
            return files2D.flat();
        }else{
            return files;
        }
    }
    return [];
}