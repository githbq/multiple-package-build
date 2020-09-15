import * as  path from 'path'
import * as jsonPretty from 'json-pretty'
import * as  fs from 'fs-extra'
import * as  globby from 'globby'
import copy from 'globby-copy-promise'

let cwd = process.cwd()
const replacePathSplit = (str) => (str || '').replace(/\\/g, '/')

const outputPath = replacePathSplit(path.resolve(cwd, 'dist'))
let packages = []

const packageDependenciesTransform = async (dependencies, packagePath) => {
    const promises = ([].concat(dependencies)).map(async dependency => {
        const promises = Object.keys(dependency).map(async (name) => {
            if (!dependency[name].startsWith('file:')) return
            let refPackageJSONPath = path.join(packagePath, dependency[name].substring(5), 'package.json')
            const refPackageJSON = await fs.readJSON(refPackageJSONPath)
            dependency[name] = `^${refPackageJSON.version}`
        })
        await Promise.all(promises)
    })
    await Promise.all(promises)
}

const tasks = [
    {
        describe: '处理dist目录',
        action:
            async () => {
                await fs.remove(outputPath)
                await fs.ensureDir(outputPath)
            }
    },
    {
        describe: '查找包工程',
        action:
            async () => {
                const files = await globby(['**/package.json', '!**/node_modules/**/*', '!**/templates/**/*'])
                packages = files.map(n => replacePathSplit(path.dirname(n)))
            }
    },
    {
        describe: '复制目录',
        action:
            async () => {
                const promises = packages.map(n => {
                    return copy([`${n}/**/*`, '!**/node_modules/**/*'], outputPath)
                })
                await Promise.all(promises)
            }
    },
    {
        describe: '转换file包',
        action:
            async () => {
                const outputPackagePaths = packages.map(n => replacePathSplit(path.join(outputPath, n)))
                const promises = outputPackagePaths.map(async outputPackagePath => {
                    const packageJSON = await fs.readJSON(path.join(outputPackagePath, 'package.json'))
                    if (packageJSON.private) {
                        delete packageJSON.private
                    }
                    await packageDependenciesTransform(
                        [packageJSON.dependencies || {}, packageJSON.devDependencies || {}],
                        outputPackagePath
                    )
                    await fs.outputFile(path.join(outputPackagePath, 'package.json'), jsonPretty(packageJSON, null, 2, 80))
                })
                await Promise.all(promises)
            }
    }
]

const run = async (options?) => {
    options = options || {}
    cwd = options.cwd || cwd
    for (let task of tasks) {
        console.time(task.describe)
        try {
            await task.action()
        } catch (e) {
            console.error(task.describe, e)
        }
        console.timeEnd(task.describe)
    }
    console.log('good job ,多包项目处理准备完毕')
}

export default run



