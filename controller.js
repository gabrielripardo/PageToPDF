<<<<<<< Updated upstream

var BrowserAutomator = require('./BrowserAutomator');

var myPage = new BrowserAutomator();

function gerarAcao(){
    document.getElementById("start").innerText = 'Clicou';
    var url = document.getElementById("urlBox").innerHTML;
    myPage.openPage('https://www.passeidireto.com/arquivo/44072199/bases-numericas');
}
function tirarScrenshot(){
    myPage.captureScreen();
}
function openTest(){
    myPage.hideBrowser();
}
=======
var BrowserAutomator = require('./BrowserAutomator'); 
 
var myPage = new BrowserAutomator('A2', 5); 
 
function gerarAcao(){     
    myPage.openPage('https://www.passeidireto.com/arquivo/44072199/bases-numericas'); 
} 

gerarAcao();
>>>>>>> Stashed changes
