'use strict'

const { table, randomSlice, genFeedKey } = require('../utils/common')
const render = require('../utils/render')
const { getTimeline } = require('../utils/weibo')
const log = require('../utils/logger')
const Weibos = table('weibos')
const Feeds = table('feeds')

module.exports = async function () {
    let list = await Weibos.scan(null, null, 1000)
    list = randomSlice(list, 3)

    let arr = await Promise.all(list.map(item => getTimeline(item._key)))
    arr = [].concat(...arr)

    let finalarr = await Promise.all(arr.map(item => {
        return new Promise(async res => {
            item.imgs = item.images.map(url => `<img src="${url}" />`).join('')
            let content = await render('weibo', item)
            res({
                _key: genFeedKey(),
                source: JSON.stringify(item),
                content,
                updated: parseInt(Date.now() / 1000),
                summary: item.nickname,
                title: '【微博】' + item.nickname
            })
        })
    }))

    await Feeds.put(finalarr)
    log(`fetch weibo timeline from ${list.map(i => i._key).join(', ')}, count: ${arr.length}`)
}