'use strict'

exports.handler = async function (event) {
    return event.httpMethod ?
        await httpHandler(event) :
        await cronHandler(event)
}

async function httpHandler({ httpMethod, body }) {
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body)
        } catch (err) {
            return {
                statusCode: 400,
                headers: {},
                body: 'Invalid body',
                isBase64Encoded: false
            }
        }
    }

    if (httpMethod === 'GET') {
        // return feed content
    }

    if (httpMethod === 'POST') {
        if (typeof body.api !== 'string')
            return sendError('Invalid api')

        return await apiRouter(data)
    }
}

async function cronHandler({ Time }) { }

function sendError(message) {
    return {
        statusCode: 400,
        headers: {},
        isBase64Encoded: false,
        body: JSON.stringify({ message })
    }
}

async function apiRouter(data) {
    const routes = {
        addUser: require('./actions/addUser')
    }
    if (typeof routes[data.api] !== 'function')
        return sendError('Unknow api')
    else return await routes[data.api](data)
}