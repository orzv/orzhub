'use strict'

const { table, httpGet } = require('./utils')
const Avatars = table('avatars')
const { getWeiboImageHash } = require('./weiboTools')

exports.insertWeiboAvatar = async function () {
    console.log(new Date)
    let url = 'https://m.weibo.cn/api/container/getIndex?containerid=102803&openApp=0'
    let html = await httpGet(url)

    let data = JSON.parse(html)
    let list = data.data.cards.filter(i => i.card_type === 9)
        .map(i => i.mblog.user.avatar_hd.replace('orj480', 'large'))

    let arr = list.map(url => {
        return {
            _key: getWeiboImageHash(url),
            url, referer: 'weibohot'
        }
    })

    await Avatars.put(arr)
    return { count: arr.length }
}