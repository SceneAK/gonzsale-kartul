export function generateUpdateQuery(body, table_name, id_name, id_value)
{
    let updateQuery = `UPDATE ${table_name} SET `;
    const params = [];
    for(const key in body)
    {
        updateQuery += `${key} = ?, `;
        params.push(body[key]);
    }
    updateQuery = updateQuery.slice(0, -2) + ` WHERE ${id_name} = ?`; // removes the ", "
    params.push(`${id_value}`);
    return {query: updateQuery, params};
}
