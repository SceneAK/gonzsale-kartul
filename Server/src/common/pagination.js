
export function paginationOption(page, limit = 40)
{
    return {
        limit,
        offset: (page-1)*limit
    }
}
export function reformatFindCountAll(result, page)
{
    const {rows, count, ...others} = result;
    const totalPages = Math.ceil(count/rows.length);
    const transformed = {
        items: rows,
        total: count,
        page,
        totalPages,
        ...others
    }
    transformed.itemsToJSON = () => {transformed.items = transformed.items.map(item => item.toJSON()); return transformed;}
    return transformed;
}