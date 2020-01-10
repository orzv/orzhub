'use strict'

const { table, getRowkeyDate } = require('../utils/common')
const Logs = table('logs')

module.exports = async function () {
    let list = await Logs.scan(null, null, 100) || []
    return list.map(item => {
        let time = getRowkeyDate(item._key)
        time = time.toISOString().replace(/T|\.\d+|Z/g, ' ').trim()
        return time + '\t' + item.message
    }).join('\n')
}