'use strict'

const Heap = require('buckets-js').Heap
const LogNode = require('./log-node')
const _ = require('lodash')


module.exports = (logSources, printer) => {
    if (_.isEmpty(logSources) || _.isEmpty(printer)) {
        throw new Error('Invalid arguments!')
    }

    process(logSources, printer, new Heap(LogNode.comparator))
}

async function process(logSources, printer, heap) {
    await Promise.all(logSources.map(async (logSource, logSourceIndex) => {
        await addFirstAvailableLogFromLogSourceToHeap(logSource, logSourceIndex, heap)
    }))

    while (!heap.isEmpty()) {
        const minLogNode = heap.removeRoot()
        const consumedLogSourceIndex = minLogNode.logSourceIndex
        const consumedLogSource = logSources[consumedLogSourceIndex]

        printer.print(minLogNode.log)

        await addFirstAvailableLogFromLogSourceToHeap(consumedLogSource, consumedLogSourceIndex, heap)
    }

    printer.done()
}

async function addFirstAvailableLogFromLogSourceToHeap(logSource, logSourceIndex, heap) {
    const log = await logSource.popAsync()
    if (!log) {
        return
    }

    heap.add(new LogNode(log, logSourceIndex))
}
