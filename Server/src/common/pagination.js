export function paginationOption(page, limit = 50)
{
    return {
        limit,
        offset: (page-1)*limit
    }
}