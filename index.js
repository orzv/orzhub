'use strict'

const { router, get, post } = require('microrouter')
const { addAvatar, getAvatar } = require('./avatar')
const { addOasisPic, getOasisFeed } = require('./oasis')
const { insertWeiboAvatar } = require('./jobs')
const { job } = require('cron')

module.exports = router(
    get('/ping', ping),
    post('/avatar', addAvatar),
    get('/avatar', getAvatar),
    post('/lzmeizi', addOasisPic),
    get('/lzmeizi', getOasisFeed)
)

async function ping() {
    return { time: parseInt(Date.now() / 1000) }
}

job('3 10,40 * * * *', insertWeiboAvatar, null, true, 'Asia/Shanghai')