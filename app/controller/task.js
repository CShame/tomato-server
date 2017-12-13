'use strict';
module.exports = app => {
    class TaskController extends app.Controller {
        /**
         * 按条件查找
         */
        async list() {
            const { ctx } = this;
            let conditions = {};
            const query = ctx.request.query;
            // 按用户筛选
            if (ctx.request.currentUser) {
                conditions.userid = ctx.request.currentUser.username;
            }
            if (query.conditions) {
                conditions = JSON.parse(query.conditions);
            }
            const result = await ctx.service.task.findAll(query, conditions);
            // ctx.logger.info("task", result);

            // 设置响应体和状态码
            ctx.body = result;
            ctx.status = 200;
        }

        /**
         * 按 id 查找
         */
        async findById() {
            const { ctx } = this;
            const query = ctx.request.query;
            const id = ctx.params.id;
            await ctx.service.task.findById(query, id);
        }

        /**
         * 创建
         */
        async create() {
            const { ctx } = this;
            // 存储用户编号/username
            if (ctx.request.currentUser) {
                ctx.request.body.userid = ctx.request.currentUser.username;
            }
            const result = await ctx.service.task.create(ctx.request.body);
            ctx.status = 201;
            ctx.body = result;
        }

        /**
         * 删除
         */
        async deleteById() {
            const { ctx } = this;
            const id = ctx.params.id;
            const result = await ctx.service.task.delete(id);
            ctx.body = result;
        }

        /**
         * 按 id 更新
         */
        async updateById() {
            const { ctx } = this;
            const id = ctx.params.id;
            const body = ctx.request.body;
            const result = await ctx.service.task.updateById(id, body);
            ctx.body = result;
        }

        /**
         * 按 id 替换
         */
        async replaceById() {
            const { ctx } = this;
            const newDocument = ctx.request.body;
            const id = ctx.params.id;
            newDocument._id = id;
            const result = await ctx.service.task.replaceById(id, newDocument);
            ctx.body = result;
        }

    }
    return TaskController;
};
