'use strict'

const { createBTS } = require('btsc')
const { createHash } = require('crypto')
const { js2xml } = require('xml-js')
const { AK, SK, INSTANCE } = process.env
const dict = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

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

exports.intEncode = function (number, step = 62) {
    let res = ''
    step = BigInt(step)
    number = BigInt(number)
    while (number > step) {
        res = dict.charAt(parseInt(number % step)) + res
        number = number / step
    }
    res = dict.charAt(parseInt(number % step)) + res
    return res
}

exports.intDecode = function (str, step = 62) {
    let num = BigInt(0)
    let reverse = ''
    for (let i = 0; i < str.length; i++)
        reverse += str[str.length - i - 1]

    function n(a) {
        let s = 1
        while (a--) s *= step
        return BigInt(s)
    }
    for (let i = 0; i < reverse.length; i++) {
        num += n(i) * BigInt(dict.indexOf(reverse[i]))
    }
    return num
}