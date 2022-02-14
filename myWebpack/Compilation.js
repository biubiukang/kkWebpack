
const { join } = require('path')
const Parser = require('./parser')
const { writeFileSync } = require('fs')
class Compilation {
    constructor(compiler){
        const {options,modules} = compiler
        this.options = options
        this.modules = modules
    }
    buildModule(filename,isEntry){
        let ast = ''
        let absolutePath = ''
       if(!isEntry){
        absolutePath = join(process.cwd(),'./src/',filename)
        ast= Parser.ast(absolutePath)
       }else{
          ast= Parser.ast(filename)
       }
       const dependencies = Parser.getDependency(ast)
       const transformCode = Parser.transform(ast)
       return {filename, dependencies,transformCode}
    }
    emitFiles(){
       let _modules = ''
       const outputPath = join(
           this.options.output.path,
           this.options.output.filename
       )
       this.modules.map(_module=>{
         _modules +=`'${_module.filename}': function(module,exports,require){
             ${_module.transformCode}
         },
         
         `
       })
       const tempalte = `(function (modules) {
        var installedModules = {};
        function __webpack_require__(moduleId) {
          // Check if module is in cache
          if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
          }
          // module.exports = {};
          var module = (installedModules[moduleId] = {
            exports: {},
          });
          modules[moduleId].call(
            module.exports,
            module,
            module.exports,
            __webpack_require__
          );
          return module.exports;
        }
        return __webpack_require__('${this.options.entry}');
      })({
        ${_modules}
      });
      `;
      writeFileSync(outputPath, tempalte, 'utf8')
    }

}
module.exports = Compilation