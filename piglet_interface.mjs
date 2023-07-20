import * as url from "node:url"
import * as path from "node:path"

import NodeCompiler from "piglet-lang/node/NodeCompiler.mjs"

import {
    deref,
    intern,
    module_registry,
    qsym,
    resolve,
    symbol,
} from "piglet-lang"

import {PIGLET_PKG} from "piglet-lang/lang/util.mjs"

let vscode = null
let context = null

export async function init(inject) {
    vscode = inject.vscode
    context = inject.context
     
    global.$piglet$ = module_registry.index

    const compiler = new NodeCompiler()
    await compiler.load_package(path.join(url.fileURLToPath(deref(resolve(symbol('piglet:lang:*current-location*')))), "../../../packages/piglet"))
    intern(symbol('piglet:lang:*compiler*'), compiler)
    await compiler.load(qsym(`${PIGLET_PKG}:lang`))
    await compiler.load(qsym(`${PIGLET_PKG}:pdp-client`))

    const vscode_mod = module_registry.find_package(PIGLET_PKG).ensure_module("vscode")
    vscode_mod.required = true
    vscode_mod.intern("vscode", vscode)
    vscode_mod.intern("context", context)
}