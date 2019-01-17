var BrowserAutomator = require('./BrowserAutomator');

var myPage = new BrowserAutomator();

function converterToPDF(){
    document.getElementById("btnConvert").innerText = 'Convertendo';
    var url = document.getElementById("urlBox").innerHTML;
    myPage.openPage(url);
}
function authAccount(){
    
}
function openTest(){
    myPage.hideBrowser();
}