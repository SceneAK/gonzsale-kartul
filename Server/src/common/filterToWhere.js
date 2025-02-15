import { Op } from 'sequelize';

export default class FilterToWhereConverter {
    constructor(options)
    {
        const {toLike} = options;
        this.toLikeKeys = toLike;
    }
    convert(filter)
    {
        for(const likeKey of this.toLikeKeys)
        {
            if(filter[likeKey])
            {
                filter[likeKey] = {
                    [Op.like]: `%${filter[likeKey]}%`
                }
            }
        }
        return filter;
    }
}