export class OrderItemRepository {
    constructor(OrderItemModel, sequelize) {
        this.OrderItemModel = OrderItemModel;
        this.sequelize = sequelize;
    }

    createStatusSortLiteral() {
        let literal = 'CASE ';
        OrderItem.STATUS_ORDER.forEach((status, index) => {
            literal += `WHEN status = "${status}" THEN ${index + 1} `;
        });
        literal += 'END';
        return this.sequelize.literal(literal);
    }

    getDefaultOrder() {
        const statusSortLiteral = this.createStatusSortLiteral();
        return [[statusSortLiteral, 'ASC']];
    }

    toDatabaseModel(orderItem) {
        const { variant, order, ...data } = orderItem;
        return data;
    }

    toDomainModel(dbModel) {
        if (!dbModel) return null;
        const data = dbModel.toJSON ? dbModel.toJSON() : dbModel;
        return new OrderItem(data);
    }

    async findById(id, options = {}) {
        const model = await this.OrderItemModel.findByPk(id, options);
        return this.toDomainModel(model);
    }

    async findByOrderId(orderId) {
        const models = await this.OrderItemModel.findAll({
            where: { orderId },
            order: this.getDefaultOrder()
        });

        return models.map(model => this.toDomainModel(model));
    }

    async bulkCreate(orderItems, transaction = null) {
        const data = orderItems.map(item => this.toDatabaseModel(item));
        const options = transaction ? { transaction } : {};

        const created = await this.OrderItemModel.bulkCreate(data, options);
        return created.map(model => this.toDomainModel(model));
    }

    async update(id, updates, transaction = null) {
        const options = transaction ? { transaction } : {};
        const [updated] = await this.OrderItemModel.update(
            updates,
            { where: { id }, ...options }
        );

        return updated;
    }

    async bulkUpdate(items, fields, transaction = null) {
        const options = {
            updateOnDuplicate: fields,
            ...(transaction ? { transaction } : {})
        };

        const data = items.map(item => this.toDatabaseModel(item));
        const updated = await this.OrderItemModel.bulkCreate(data, options);

        return updated.map(model => this.toDomainModel(model));
    }

    async findByFilter(filter, includeOptions = {}) {
        const where = this.convertFilterToWhere(filter);
        const options = {
            where,
            order: this.getDefaultOrder(),
            ...includeOptions
        };

        const models = await this.OrderItemModel.findAll(options);
        return models.map(model => this.toDomainModel(model));
    }

    async deleteByOrderId(orderId, transaction = null) {
        const options = transaction ? { transaction } : {};
        return await this.OrderItemModel.destroy({
            where: { orderId },
            ...options
        });
    }

    convertFilterToWhere(filter) {
        const likeFields = ['notes'];
        const where = {};

        for (const [key, value] of Object.entries(filter)) {
            if (likeFields.includes(key)) {
                where[key] = { [this.sequelize.Op.like]: `%${value}%` };
            } else {
                where[key] = value;
            }
        }

        return where;
    }
}