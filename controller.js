var BrowserAutomator = require('./BrowserAutomator');

var url = 'https://www.passeidireto.com/arquivo/2349667/nivel-de-linguagem-de-montagem-e-arquitetura-de-computadores-paralelos';
var sessionOpen = false;
var myPage0;
var mysession;

function runApp(){
    document.getElementById("content").innerText = 'rodando app';
    
    //url = document.getElementById("urlBox").innerHTML;
    if(!sessionOpen){
        document.getElementById("content").innerText = 'obtendo cookies';
        document.getElementById("content").innerText = sessionOpen;
                
        sessionOpen = true;
        authAccount();
        
        
    }else{
        document.getElementById("content").innerText = 'cookies obtidos';
        directConvert();
    }
}
function authAccount(){
    myPage0 = new BrowserAutomator('A4', 5, false, url);     
    myPage0.openPage();
}
function directConvert(){
    document.getElementById("btnConvert").innerText = 'Convertendo';    
    var myPage1 = new BrowserAutomator('A4', 5, true, url); 
    myPage1.catchCookies.session = myPage0.catchCookies.session; //Inseri a sessão no navegador
    myPage1.openPage();
}


runApp();