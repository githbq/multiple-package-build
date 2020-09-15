#!/usr/bin/env node
import * as  yargs from 'yargs'
import helloWorld from '../index'


function start() {
    yargs.command('start',
        'hello world',
        {
        },
        async (argv) => {
            console.log(helloWorld)
        }).help()
    let argv = yargs.version().argv
    if (!argv._.length) {
        yargs.showHelp()
    }
}

start()
