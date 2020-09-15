#!/usr/bin/env node

import * as  yargs from 'yargs'
import multiplePackageBuild from '../index'


function start() {
    // let argv = yargs.version().argv
    return multiplePackageBuild()
}

start()
