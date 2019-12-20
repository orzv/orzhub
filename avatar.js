'use strict'

const { json, createError, send } = require('micro')
const {
    getWeiboImageHash,
    saveAvatarImage,
    getAvatarFromUser
} = require('./weiboTools')
const { table } = require('./utils')
const urlReg = /^https?:\/\/\S+\.sinaimg\.(com|cn)\/\S+\/\S+\.(jpg|gif)$/i
const Avatars = table('avatars')
const AVATARKEYDICT = '0123456789abcdef'

exports.addAvatar = async (req, res) => {
    let now = Date.now()
    let data = await json(req, { limit: '1mb' })
    if (typeof data.url !== 'string') {
        throw createError(400, 'Invalid url')
    }
    if (urlReg.test(data.url)) {
        let hash = getWeiboImageHash(data.url)
        let result = await saveAvatarImage(hash, data.url, 'sinaimg')
        return Object.assign({ used: Date.now() - now }, result)
    }

    if (/^https?:\/\/weibo\.com\/u\/\d+$/.test(url)) {
        let id = url.match(/\/\d+$/)[0].slice(1)
        let picurl = await getAvatarFromUser(id)
        let hash = getWeiboImageHash(picurl)
        return await saveAvatarImage(hash, picurl, 'weibouser')
    }

    if (/^\d+$/.test(url)) {
        let picurl = await getAvatarFromUser(url)
        let hash = getWeiboImageHash(picurl)
        return await saveAvatarImage(hash, picurl, 'weiboid')
    }
    throw createError(400, 'Unknow url format')
}

exports.getAvatar = async (req, res) => {
    let key = genRandomAvatarKey()
    let arr = await Avatars.scan(key, null, 10)
    let retryCount = 0
    while (!arr) {
        key = genRandomAvatarKey()
        arr = await Avatars.scan(key, null, 10)
        retryCount++
    }

    console.log('retry', retryCount)

    let index = Math.floor(arr.length * Math.random())
    res.setHeader('Location', arr[index].url)
    return send(res, 302, '')
}

function genRandomAvatarKey(len = 2) {
    let str = ''
    while (str.length < len) {
        str += AVATARKEYDICT[Math.floor(Math.random() * AVATARKEYDICT.length)]
    }
    return str
}