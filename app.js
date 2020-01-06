'use strict'

const { router, get, post } = require('microrouter')
const { job } = require('cron')
const { json, createError, sendError } = require('micro')

const apis = {
    addUser: require('./actions/addUser')
}

async function controlReducer(req, res) {
    const data = await json(req, { limit: '2mb' })

    if (typeof data.api !== 'string') {
        throw createError(400, 'Invalid api')
    }

    if (typeof apis[data.api] !== 'function') {
        throw createError(400, 'Unknow api')
    }

    return await apis[data.api](data)
}

module.exports = router(
    get('/', require('./actions/feed')),
    get('/test', require('./actions/weibo')),
    get('/stats', require('./actions/stats')),
    post('/api', controlReducer)
)

job({
    cronTime: '0 20,50 * * * *',
    onTick: require('./actions/weibo'),
    start: true,
    timeZone: 'Asia/Shanghai'
})