export function paginationOption(page, limit = 40)
{
    return {
        limit,
        offset: (page-1)*limit
    }
}