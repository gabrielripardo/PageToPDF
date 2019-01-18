var BrowserAutomator = require('./BrowserAutomator');

var url = 'https://www.passeidireto.com/arquivo/44072199/bases-numericas'
var sessionOpen = false;

function runApp(){
    //url = document.getElementById("urlBox").innerHTML;
    if(!sessionOpen){
        authAccount();
    }else{
        convertToPDF();
    }
}

function convertToPDF(){
    document.getElementById("btnConvert").innerText = 'Convertendo';
    
    var myPage = new BrowserAutomator('A2', 5); 
    myPage.openPage(url); 
}
function authAccount(){
    
}

