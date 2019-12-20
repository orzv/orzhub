'use strict'

const { createHash } = require('crypto')
const { js2xml } = require('xml-js')

module.exports = function (params) {
    let info = {
        _declaration: {
            _attributes: { version: '1.0', encoding: 'utf-8' }
        },
        feed: {
            _attributes: { xmlns: 'http://www.w3.org/2005/Atom' },
            title: { _text: params.title },
            id: { _text: params.id || generateGuid(params.title) },
            updated: { _text: (params.updated || new Date).toISOString() },
            generator: {
                _attributes: {
                    version: '1.0',
                    uri: 'https://u1qo.com/'
                },
                _text: 'orzhub'
            }
        }
    }

    if (params.subtitle) {
        info.feed.subtitle = { _text: params.subtitle }
    }
    if (params.logo) {
        info.feed.logo = { _text: params.logo }
    }
    if (params.icon) {
        info.feed.icon = { _text: params.icon }
    }
    if (params.author) {
        info.feed.author = getUserObj(params.author)
    }
    if (params.contributor) {
        info.feed.contributor = getUserObj(params.contributor)
    }
    info.feed.entry = params.entries.map(item => {
        return {
            title: { _text: item.title },
            id: { _text: item.id || generateGuid(item.title) },
            updated: (item.updated || new Date).toISOString(),
            content: {
                _attributes: {
                    type: item.type || 'html'
                },
                _text: item.content || ''
            },
            summary: { _text: item.summary || '' }
        }
    })
    return js2xml(info, { compact: true })
}

function generateGuid(prefix = '') {
    let str = prefix + Date.now().toString() + parseInt(Math.random() * 99999)
    return createHash('md5').update(str).digest('hex')
}

function getUserObj(user) {
    if (typeof user === 'string') {
        return { name: { _text: user.name } }
    } else {
        let obj = {}
        if (user.name) obj.name = { _text: user.name }
        if (user.uri) obj.uri = { _text: user.uri }
        if (user.email) obj.email = { _text: user.email }
        return obj
    }
}