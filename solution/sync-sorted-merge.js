'use strict'

const Heap = require('buckets-js').Heap
const LogNode = require('./log-node')
const _ = require('lodash')


module.exports = (logSources, printer) => {
	if (_.isEmpty(logSources) || _.isEmpty(printer)) {
		throw new Error('Invalid arguments!')
	}

	process(logSources, printer, new Heap(LogNode.comparator))
};

function process(logSources, printer, heap) {
	logSources.forEach((logSource, logSourceIndex) => {
		addFirstAvailableLogFromLogSourceToHeap(logSource, logSourceIndex, heap)
    });

	while (!heap.isEmpty()) {
		const minLogNode = heap.removeRoot()
		const consumedLogSourceIndex = minLogNode.logSourceIndex
		const consumedLogSource = logSources[consumedLogSourceIndex]

        printer.print(minLogNode.log)

        addFirstAvailableLogFromLogSourceToHeap(consumedLogSource, consumedLogSourceIndex, heap)
	}

    printer.done()
}

function addFirstAvailableLogFromLogSourceToHeap(logSource, logSourceIndex, heap) {
    const log = logSource.pop()
    if (!log) {
        return
    }

    heap.add(new LogNode(log, logSourceIndex))
}
