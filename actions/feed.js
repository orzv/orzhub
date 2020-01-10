const { table, getRowkeyDate } = require('../utils/common')
const Feeds = table('feeds')
const atom = require('../utils/atom')
const getFeed = require('../utils/feed')

module.exports = async function () {
    let list = await Feeds.scan(null, null, 100)
    return getFeed({
        title: 'orzhub',
        subtitle: 'Aho',
        id: 'orzhub',
        icon: '',
        logo: '',
        updated: new Date().toISOString(),
        entries: list.map(item => {
            let obj = Object.assign({}, item)
            obj.id = 'orzhub:' + item._key
            return obj
        })
    })
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