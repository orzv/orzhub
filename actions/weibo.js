'use strict'

const { table, randomSlice, genFeedKey, md5 } = require('../utils/common')
const render = require('../utils/render')
const { getTimeline } = require('../utils/weibo')
const log = require('../utils/logger')
const Weibos = table('weibos')
const Feeds = table('feeds')
const Excludes = table('exclude_words')
const SourceHash = table('source_hash')

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
                title: '【微博】' + item.nickname,
                hash: md5(content)
            })
        })
    }))

    let existsHashes = await SourceHash.get(finalarr.map(item => item.hash))
    existsHashes = existsHashes.map(item => item._key)

    finalarr = finalarr.filter(item => !existsHashes.includes(item.hash))

    await Feeds.put(finalarr)
    await SourceHash.put(finalarr.map(item => {
        return {
            _key: item.hash,
            time: parseInt(Date.now() / 1000)
        }
    }))
    log(`fetch weibo timeline from ${list.map(i => i._key).join(', ')}, count: ${arr.length}`)
}