'use strict';
/*
 * @Author: kobepeng
 * @Date: 2017-12-06 09:21:23
 * @Last Modified by: kobepeng
 * @Last Modified time: 2017-12-13 14:14:20
 */
module.exports = app => {
    /**
     * 消息
    */
    const mongoose = app.mongoose;
    const ObjectId = mongoose.Schema.ObjectId;
    const pub_reply = new mongoose.Schema({
        // 内容
        content: { type: String },
        // 动态编号
        pub_id: { type: ObjectId },
        // 发布者
        author_id: { type: ObjectId },
        // 回复者
        reply_id: { type: ObjectId },
        // 回复时间
        create_at: { type: Date, default: Date.now },
        // 更新时间
        update_at: { type: Date, default: Date.now },
        // 是否为富文本
        content_is_html: { type: Boolean },
        // 点赞数
        ups: [ mongoose.Schema.Types.ObjectId ],
        // 删除标识
        deleted: { type: Boolean, default: false },
    });

    pub_reply.index({ pub_id: 1 });
    pub_reply.index({ author_id: 1, create_at: -1 });
    return mongoose.model('pub_reply', pub_reply);
};
