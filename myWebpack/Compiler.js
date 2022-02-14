const {SyncHook} = require ("tapable")
const Compilation =require('./Compilation')
class Compiler {
    constructor(options){
        this.options = options
        this.modules = []
        this.hooks = {
            run: new SyncHook()
        }
    }
    run() {
        const compilation = this.newCompilation()
        // 合适时机触发钩子函数
        this.hooks.run.call(compilation)
        // 找到entry 从入口开始分析
        const entryModule = compilation.buildModule(this.options.entry,true)
        this.modules.push(entryModule)
       
        this.modules.map((_module)=>{
            _module.dependencies.map(dependency=>{
                this.modules.push(compilation.buildModule(dependency,false))
            })
        }) 
        console.log(this.modules,'🍌')
        compilation.emitFiles()
    }
    newCompilation() {
        const compilation = this.createCompilation();
        return compilation;
    }
    createCompilation(){
        return new Compilation(this)
    }
}
module.exports = Compiler