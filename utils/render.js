'use strict'

const { template } = require('lodash')
const { join } = require('path')
const { readFile } = require('fs').promises

module.exports = async function (name, data) {
    const html = await readFile(
        join('./templates', name + '.html'), {
        encoding: 'utf8'
    })
    return template(html)(data)
}