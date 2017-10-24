'use strict'

const LogSource = require('../lib/log-source')
const _ = require('lodash')

module.exports = class LogNode {
    constructor(log, logSourceIndex) {
        this._log = log
        this._logSourceIndex = logSourceIndex
    }

    get log() {
        return this._log
    }

    get logSourceIndex() {
        return this._logSourceIndex
    }

    static comparator(firstNode, secondNode) {
        const firstLog = firstNode ? firstNode.log : null
        const secondLog = secondNode ? secondNode.log : null

        if (_.isEmpty(firstLog) || _.isEmpty(secondLog)) {
            throw new Error('Cannot compare invalid logs!!')
        }

        return LogSource.compare(firstLog, secondLog)
    }
};