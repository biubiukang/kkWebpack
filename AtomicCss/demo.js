const Styletron = require('styletron')
const {injectStyle} = require('styletron')
const styletron = new Styletron();
const parsedCss = require('./main.css')
console.log('parsedCss',parsedCss)
const redButton = injectStyle(styletron,{
    color:"red",
    fontSize:'14px'
})
const blueButton = injectStyle(styletron,{
    color:"blue",
    fontSize:'14px'
})
console.log(redButton,blueButton)