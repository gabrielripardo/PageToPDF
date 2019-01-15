
var BrowserAutomator = require('./BrowserAutomator');

var myPage = new BrowserAutomator();

function gerarAcao(){
    document.getElementById("start").innerText = 'Clicou';
    var url = document.getElementById("urlBox").innerHTML;
    myPage.openPage('http://google.com');
}
