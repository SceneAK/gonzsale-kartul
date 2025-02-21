
export function paginationOption(page, itemsPerPage = 40)
{
    return {
        limit: itemsPerPage,
        offset: (page-1)*itemsPerPage,
        distinct: true
    }
}
export function reformatFindCountAll(result, page, itemsPerPage = 40)
{
    const {rows, count, ...others} = result;
    const totalPages = Math.ceil(count/itemsPerPage);
    const transformed = {
        items: rows,
        totalItems: count,
        page,
        totalPages,
        ...others
    }
    transformed.itemsToJSON = () => {transformed.items = transformed.items.map(item => item.toJSON()); return transformed;}
    return transformed;
}