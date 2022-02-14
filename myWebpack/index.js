const { plugins } = require('../mywebpack.config');
const Compiler = require('./Compiler');
const options = require('../mywebpack.config')
const compiler = new Compiler(options)

for(const plugin of options.plugins){
    plugin.apply(compiler)
}
compiler.run()