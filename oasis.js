'use strict'

const { createError, json } = require('micro')
const { httpGet, table, intEncode, intDecode } = require('./utils')
const { getWeiboImageHash } = require('./weiboTools')
const toAtom = require('./atom')
const { js2xml } = require('xml-js')
const Oasis = table('oasis_meizi')
const MAX = intDecode('zzzzzz', 62)

exports.addOasisPic = async (req, res) => {
    let { url } = await json(req, { limit: '1mb' })
    if (!/^https:\/\/m\.oasis\.weibo\.cn\/v1\/h5\/share\?sid\=\d+$/.test(url)) {
        throw createError(400, 'Invalid url')
    }

    let html = await httpGet(url)
    let arr = html.match(/slide-box[\s\S]+?https.*?\.jpg|gif/gm)
    arr = arr.map(str => str.match(/https?.+?\.jpg|gif/)[0]
        .replace('/osj1080/', '/large/'))

    let time = new Date
    time.setMinutes(0, 0, 0)
    time = intEncode(parseInt(MAX) - parseInt(time.getTime() / 1000), 62)

    let list = arr.map(url => {
        return { url, _key: time + getWeiboImageHash(url).slice(0, 6) }
    })

    await Oasis.put(list)

    console.log(list)

    return { count: list.length }
}

exports.getOasisFeed = async (req, res) => {
    // let time = new Date(Date.now() - 60 * 60 * 1000)
    let time = new Date(Date.now())
    time.setMinutes(0, 0, 0)
    time = intEncode(parseInt(MAX) - parseInt(time.getTime() / 1000), 62)

    console.log(time)

    let list = await Oasis.scan(time, null, 100)

    let timelabel = list.reduce((all, cur) => {
        let time = cur._key.slice(0, 6)
        time = parseInt(MAX - intDecode(time, 62))
        all.add(time)
        return all
    }, new Set)

    timelabel = [...timelabel]

    if (timelabel.length > 1) {
        timelabel.pop()
    }

    let entries = timelabel.map(time => {
        let date = new Date(time * 1000)
        let prefix = intEncode(MAX - BigInt(time), 62)

        let pics = list.filter(item => item._key.slice(0, 6) === prefix)
        pics = pics.map(i => i.url)

        let title = `妹子图${date.getMonth() + 1}月${date.getDate()}日`
        title += `${date.getHours()}时图片集`

        return {
            title, author: 'orzv', summary: `${pics.length}张图片`,
            content: js2xml({
                img: pics.map(url => {
                    return {
                        _attributes: {
                            src: url,
                            referrerPolicy: 'no-referrer'
                        }
                    }
                })
            }, { compact: true }),
            updated: date,
            id: 'OASIS-MEIZI-' + prefix
        }
    })

    timelabel.sort()
    let last = timelabel[timelabel.length - 1]
    console.log(last)

    return toAtom({
        title: '绿洲妹子图',
        subtitle: '每日分享绿洲美女图片，冲冲冲',
        id: 'https://u1qo.com/',
        entries,
        updated: new Date(last * 1000)
    })
}