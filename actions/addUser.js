'use strict'

const { json, createError } = require('micro')
const { table } = require('../utils/common')
const { getUserinfo } = require('../utils/weibo')
const log = require('../utils/logger')
const Weibos = table('weibos')

module.exports = async function (data) {
    if (typeof data.uid !== 'string') {
        throw createError(400, 'Invalid uid')
    }

    let info = await getUserinfo(data.uid)

    log('add weibo ' + data.uid)
    return await Weibos.put(data.uid, info)
}