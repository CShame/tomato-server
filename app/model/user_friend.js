'use strict';

module.exports = app => {
    /**
     * 好友关系
     */
    const mongoose = app.mongoose;
    const ObjectId = mongoose.Schema.ObjectId;
    const user_friend = new mongoose.Schema({
        // 用户编号( 发起者 )
        from_userid: { type: ObjectId },
        // 用户编号( 接受者 )
        to_userid: { type: ObjectId },
        // 请求时间
        request_time: { type: Date },
        // 回复时间
        response_time: { type: Date },
        // 状态:1(发起请求待回复)、2(回复且同意)、3(回复且拒绝)、4(忽略)
        state: { type: Number },
        // 权限
        permission_level: { type: String },
        // 是否已删除
        deleted: { type: Boolean, default: false },
    });

    user_friend.index({ userid: 1, friendid: 1 });
    return mongoose.model('user_friend', user_friend);
};
