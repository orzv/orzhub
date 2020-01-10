'use strict'

const fetch = require('node-fetch')

exports.getTimeline = async function (uid) {
    let url = `https://m.weibo.cn/api/container/getIndex?type=uid&value=${uid}&containerid=107603${uid}`
    let res = await fetch(url)
    let json = await res.json()
    return json.data.cards.filter(i => i.card_type === 9).map(item => {
        let data = item.mblog
        if (data.retweeted) {

        }
        return {
            content: data.text,
            nickname: data.user.screen_name,
            avatar: data.user.avatar_hd,
            images: (data.pics || []).map(item => {
                return item.large.url
            })
        }
    })
}

exports.getUserinfo = async function (uid) {
    let url = `https://m.weibo.cn/api/container/getIndex?type=uid&value=${uid}&containerid=100505${uid}`
    let res = await fetch(url)
    let json = await res.json()
    return {
        nickname: json.data.userInfo.screen_name,
        avatar: json.data.userInfo.avatar_hd
    }
}