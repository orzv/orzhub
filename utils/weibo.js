'use strict'

const { httpGet, md5 } = require('./common')

exports.getTimeline = async function (uid) {
    let url = `https://m.weibo.cn/api/container/getIndex?type=uid&value=${uid}&containerid=107603${uid}`
    let html = await httpGet(url)
    let json = JSON.parse(html)
    return json.data.cards.filter(i => i.card_type === 9).map(item => {
        return {
            content: item.mblog.text,
            nickname: item.mblog.user.screen_name,
            avatar: item.mblog.user.avatar_hd,
            images: (item.mblog.pics || []).map(item => {
                return item.large.url
            })
        }
    })
}

exports.getUserinfo = async function (uid) {
    let url = `https://m.weibo.cn/api/container/getIndex?type=uid&value=${uid}&containerid=100505${uid}`
    let html = await httpGet(url)
    let json = JSON.parse(html)
    return {
        nickname: json.data.userInfo.screen_name,
        avatar: json.data.userInfo.avatar_hd
    }
}