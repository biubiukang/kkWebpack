const {default: traverse} = require('babel-traverse')
const {join} =require('path')
const babylon = require('babylon')
const fs = require('fs')
const {transformFromAst} = require('@babel/core')
class Parser {
    static ast(path) {
        const content = fs.readFileSync(path,'utf-8');
        return babylon.parse(content,{
            sourceType: 'module'
        })

    }
    static getDependency(ast){
        const depenndencies = []
        traverse(ast,{
            ImportDeclaration:({node})=>{
             depenndencies.push(node.source.value)
            }
        })
        console.log()
        return depenndencies
    }
    static transform(ast){
       const {code} = transformFromAst(ast,null,{
          presets:['@babel/preset-env'],
       })
       console.log(code,'code')
       return code
    }
}
module.exports = Parser