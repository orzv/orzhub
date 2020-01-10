const { readFileSync } = require('fs')
const { template } = require('lodash')

module.exports = function (data) {
    const entryTemplate = readFileSync('../templates/entry.xml')
    const feedTemplate = readFileSync('../templates/feed.xml')
    const entries = data.entries.map(item => {
        return template(entryTemplate)(item)
    })
    data.entries = entries
    return template(feedTemplate)(data)
}