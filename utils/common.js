'use strict'

const { createBTS } = require('btsc')
const { createHash } = require('crypto')
const { AK, SK, INSTANCE } = process.env

exports.httpGet = function (url) {
    return new Promise(resolve => {
        /**
         * @constant {'http' | 'https'}
         */
        let protocol = require('url').parse(url).protocol.slice(0, -1)

        require(protocol).get(url, res => {
            res.setEncoding('utf8')
            let result = ''
            res.on('data', str => result += str)
            res.on('end', () => resolve(result))
            res.on('error', resolve)
        }).on('error', resolve)
    })
}

exports.table = name => createBTS(`${AK}:${SK}@gz:${INSTANCE}/${name}`)

exports.md5 = src => createHash('md5').update(src).digest('hex')

exports.md5_s = src => exports.md5(src).slice(0, 8)

exports.md5_m = src => exports.md5(src).slice(0, 16)

/**
 * @param {Array} arr 数组
 * @param {number} count 数量
 */
exports.randomSlice = function (arr, count) {
    if (count >= arr.length) return arr
    let res = [], sets = {}
    while (res.length < count) {
        let index = Math.floor(Math.random() * arr.length)
        if (sets[index]) continue
        res.push(arr[index])
        sets[index] = 1
    }

    return res
}

exports.genFeedKey = function () {
    let time = parseInt(10e9 - 1 - Date.now() / 1000).toString()
    return time + parseInt(Math.random() * 9999).toString().padStart(4, '0')
}

exports.getRowkeyDate = function (key) {
    let time = parseInt(key.slice(0, 10))
    time = new Date((10e9 - 1 - time) * 1000)
    return time
}