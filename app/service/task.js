module.exports = app => {
  class TaskService extends app.Service {
    async findAll(query, conditions) {
      let model = await this.ctx.model.task;
      let builder = model.find(conditions);
      if (query.select) {
        select = JSON.parse(query.select);
        builder = builder.select(select);
      }

      ["limit", "skip", "sort", "count"].forEach(key => {
        if (query[key]) {
          let arg = query[key];
          if (key === "limit" || key === "skip") {
            arg = parseInt(arg);
          }
          if (key === "sort" && typeof arg === "string") {
            arg = JSON.parse(arg);
          }
          if (key !== "count") builder[key](arg);
          else builder[key]();
        }
      });
      const result = await builder.exec();
      return result;
    }

    async findById(query, id) {
      let model = await this.ctx.model.task;
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
      let model = await this.ctx.model.task;
      const result = await model.create(body);
      return result;
    }

    async delete(id) {
      let model = await this.ctx.model.task;
      const result = await model.findByIdAndRemove(id).exec();
      return result;
    }

    async updateById(id, body) {
      let model = await this.ctx.model.task;
      const result = await model
        .findByIdAndUpdate(id, body, {
          new: true
        })
        .exec();
      return result;
    }

    async updateById(id, body) {
      let model = await this.ctx.model.task;
      const result = await model
        .findByIdAndUpdate(id, body, {
          new: true
        })
        .exec();
      return result;
    }

    async replaceById(id, newDocument) {
      let model = await this.ctx.model.task;
      await model.findByIdAndRemove(id).exec();
      const result = await model.create(newDocument);
      return result;
    }
  }
  return TaskService;
};