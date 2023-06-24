'use strict';

const _ = require('lodash')
const Promise = require('promise') || this.Promise
const agent = require('superagent-promise')(require('superagent'), Promise);

const makeHttpRequest = async (path, method, options) =>{
    let root = process.env.TEST_ROOT
    let url = `${root}/${path}`
    let httpReq = agent(method, url)
    let body = _.get(options, "body")
    
    let idToken = _.get(options, "idToken")

    try {
        httpReq.set("Authorization", idToken)
        if(body){
            console.log('sending body')
            httpReq.send(body)
        }
        console.log(`invoking ${method} ${url}...`)
        let response = await httpReq;
        console.log(`back from .. ${method} ${url}`)
        return {
            statusCode : response.status,
            body : response.body    
        }
    } catch (error) {
        console.log('>>>',JSON.stringify(error))
        return {
            statusCode : error.status,
            body : null
        }
    }
}

module.exports.we_invoke_create_note = async (options) => {
    let response = await makeHttpRequest('notes', 'POST', options)    
    return response;
}

module.exports.we_invoke_update_note = async (options) => {
    let response = await makeHttpRequest(`notes/${options.noteId}`, 'PUT', options)    
    return response;
}

module.exports.we_invoke_delete_note = async (options) => {
    let response = await makeHttpRequest(`notes/${options.noteId}`, 'DELETE', options)    
    console.log("back from delete", response)
    return response;
}