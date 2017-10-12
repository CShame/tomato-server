module.exports = mongoose => {
    /**
     * 网站说明
     */
    let option = new mongoose.Schema({
        // 键
        key: String,
        // 值
        value: Schema.Types.Mixed,
        // 描述
        desc: String
    });
    return mongoose.model("option", option);
}
