'use strict';

const Service = require('egg').Service;
class TomatoService extends Service {
    async statistics(userid, startTime, endDate, succeed) {
        const Tomato = this.ctx.model.Tomato;

        const res = await Tomato.aggregate([
            {
                $match: {
                    userid,
                    succeed: parseInt(succeed),
                    startTime: { $gte: new Date(startTime), $lte: new Date(endDate) },
                },
            },
            {
                $project: {
                    // 校准日期并格式化
                    startTime: { $substr: [{ $add: [ '$startTime', 28800000 ] }, 0, 10 ] },
                    succeed: 1,
                },
            },
            {
                $group: {
                    _id: '$startTime',
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);
        return res;
    }

    async findAll(query, conditions) {
        const model = this.ctx.model.Tomato;
        if (conditions) {
            if (!conditions.deleted) {
                conditions.deleted = false;
            }
        }
        let builder = model.find(conditions);
        if (query.select) {
            const select = JSON.parse(query.select);
            builder = builder.select(select);
        }

        [ 'limit', 'skip', 'sort', 'count' ].forEach(key => {
            if (query[key]) {
                let arg = query[key];
                if (key === 'limit' || key === 'skip') {
                    arg = parseInt(arg);
                }
                if (key === 'sort' && typeof arg === 'string') {
                    arg = JSON.parse(arg);
                }
                if (key !== 'count') builder[key](arg);
                else builder[key]();
            }
        });
        const result = await builder.exec();
        return result;
    }

    async findById(query, id) {
        const model = this.ctx.model.Tomato;
        let select = {};
        let builder = model.findById(id);
        if (query.select) {
            select = JSON.parse(query.select);
            builder = builder.select(select);
        }
        const result = await builder.exec();
        return result;
    }

    async create(body) {
        const model = this.ctx.model.Tomato;
        const result = await model.create(body);
        return result;
    }

    async delete(id) {
        const model = this.ctx.model.Tomato;
        await model.updateOne({ _id: id }, { deleted: true }, {});
        return true;
    }

    async updateById(id, body) {
        const model = await this.ctx.model.Tomato;
        const result = await model
            .findByIdAndUpdate(id, body, {
                new: true,
            })
            .exec();
        return result;
    }

    async replaceById(id, newDocument) {
        const model = this.ctx.model.Tomato;
        await model.findByIdAndRemove(id).exec();
        const result = await model.create(newDocument);
        return result;
    }
}
module.exports = TomatoService;
