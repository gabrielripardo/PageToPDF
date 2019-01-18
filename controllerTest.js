var BrowserAutomator = require('./BrowserAutomator'); 
 

 
function gerarAcao(){     
    var myPage = new BrowserAutomator('A2', 5); 
    myPage.openPage('https://www.passeidireto.com/arquivo/44072199/bases-numericas'); 
} 

gerarAcao();