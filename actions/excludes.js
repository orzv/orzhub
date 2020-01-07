'use strict'

const { createError } = require('micro')
const { table, md5_s } = require('../utils/common')
const Excludes = table('exclude_words')

exports.addWords = async function (data) {
    let { key, content, name } = data
    if (typeof content !== 'string' || !content) {
        throw createError(400, 'Invalid content')
    }

    if (typeof name !== 'string') {
        throw createError(400, 'Invalid name')
    }

    if (!key) key = md5_s(content)
    return await Excludes.put(key, { content, name })
}