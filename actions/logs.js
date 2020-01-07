'use strict'

const { table, getRowkeyDate } = require('../utils/common')
const Logs = table('logs')

module.exports = async function (req, res) {
    let list = await Logs.scan(null, null, 100)
    res.setHeader('Content-Type', 'text/plain')
    return (list || []).map(item => {
        return getRowkeyDate(item._key).toISOString() + '\t'
            + item.message
    }).join('\n')
}