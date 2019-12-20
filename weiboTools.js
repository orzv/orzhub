'use strict'

const { httpGet, md5 } = require('./utils')

/**
 * 获取微博图片hash
 * @param {string} url 微博图片地址
 * @return {string}
 */
exports.getWeiboImageHash = function (url) {
    let picname = url.match(/\/\w+\.jpg|gif$/)[0].slice(9, -4)
    return md5(picname).slice(0, 8)
}

/**
 * 保存头像图片
 * @param {string} id ID
 * @param {string} url 图片地址
 * @param {string} referer 图片来源
 * @return {Object}
 */
exports.saveAvatarImage = async function (id, url, referer) {
    let tmp = await Avatars.get(id)
    if (tmp) throw httpError('Picture is exists', 200)
    await Avatars.put(id, { url, referer })
    return { id }
}