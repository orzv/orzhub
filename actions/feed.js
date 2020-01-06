'use strict'

const { table, getRowkeyDate } = require('../utils/common')
const Feeds = table('feeds')
const atom = require('../utils/atom')

module.exports = async function (req, res) {
    let list = await Feeds.scan(null, null, 100)
    res.setHeader('Content-Type', 'text/xml+atom')
    return atom({
        title: 'orzhub',
        subtitle: 'Only you',
        author: {
            name: 'orzv',
            email: 'orzv@outlook.com'
        },
        id: 'http://u1qo.com/',
        updated: getRowkeyDate(list[0]._key),
        entries: list.map(item => {
            return {
                content: item.content,
                updated: new Date(+item.updated * 1000),
                id: 'orzhub://' + item._key,
                title: item.title,
                summary: item.summary
            }
        })
    })
}