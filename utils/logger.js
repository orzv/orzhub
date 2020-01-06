'use strict'

const { table } = require('../utils/common')
const Logs = table('logs')

module.exports = async function (message) {
    let time = new Date()
    console.log(`${time.toISOString()}\t${message}`)

    let rnd = parseInt(Math.random() * 9999).toString().padStart(4, '0')
    let key = 10e9 - 1 - parseInt(time.getTime() / 1000)

    await Logs.put(key.toString() + rnd, { message })
}