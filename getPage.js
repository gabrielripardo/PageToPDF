const puppeteer = require('puppeteer')            

async function openPage(url){
    const browser = await puppeteer.launch();   //Modo handler
    //const browser = await puppeteer.launch({ headless: false });     //Modo browser chrome nativo
    var page = await browser.newPage();         
    await page.goto(url);    

    inserirCokies(page, browser, url);
}
async function inserirCokies(page, browser, url){
    const cookies = [{
        'name': '_fbp',
        'value': 'fb.1.1546445635572.1436825322'
    },{
        'name': '_ga',
        'value': 'GA1.2.42711130.1546445613'
    },{
        'name': '_gat_UA2484496511',
        'value': '1'
    },{
        'name': '_gat_UA248449652',
        'value': '1'
    },{
        'name': '_gid',
        'value': 'GA1.2.285114252.1546445613'
    },{
        'name': 'cto_lwid',
        'value': 'ab20bc42-1b74-4810-8289-5d3816ade5e0'
    },{
        'name': 'first_accessed_page',
        'value': 'https://www.passeidireto.com/'
    },{
        'name': 'session_key',
        'value': 'ad6d7ed817fd15b6194952b031eb9079'
    }];
    
    await page.setCookie(...cookies);
    const cookiesSet = await page.cookies(url);
    await page.goto(url);
    console.log(JSON.stringify(cookiesSet));
    
    //await page.waitFor(20000);
    modifyElements(page, browser);
    //goByPage(page, browser);
}
async function runMouse(page){
    var cont = 0;
    while(cont < 1000){
        await page.mouse.move(100, 100);        
        await page.mouse.move(200, 200);             
        await page.waitFor(1000);              
        console.log(cont++);
    }
}
async function goByPage(page, browser){              
    //Espera o seletor ser carregado
    await page.waitForSelector('#app > div.application--wrap > main > div > div > div > div > div.layout.align-space-around.justify-space-around.row.fill-height > div.flex.mv-material-viewer-main > div.mv-file.mv-content.limitation-bar > div.mv-file-contents > div > div > div.file-viewer-navigator > div > div.pages-info > input[type="number"]')
    
    //Contadores de páginas
    var nPage = 1;
    var nPageMax = 7;
    while(nPage <= nPageMax){                    
        
        //Clica no campo
        await page.click('#app > div.application--wrap > main > div > div > div > div > div.layout.align-space-around.justify-space-around.row.fill-height > div.flex.mv-material-viewer-main > div.mv-file.mv-content.limitation-bar > div.mv-file-contents > div > div > div.file-viewer-navigator > div > div.pages-info > input[type="number"]');   
        //Apaga e inseri o nº da pág. e depois 3 segundos vai para próxima.        
        await page.keyboard.press('Backspace');        
        await page.keyboard.type(nPage.toString());
        await page.waitFor(3000);     // Tempo para que que todos os elemento da página carrege      
        getPage(page, nPage);
        await page.waitFor(2000);   // Tempo para que o método getPage gere o pdf.        
        nPage++;
    }    
    closePage(browser);
}
async function getPage(page, nPage){
    await page.emulateMedia('screen');
    var path = 'pag. '+ nPage.toString()+'.pdf';
    //await page.screenshot({path: path});
    await page.pdf({path: path, format: 'A4'});              
}     
async function closePage(browser){
    await browser.close(); 
    console.log("Procedimento finalizado!");    
} 
async function modifyElements(page, browser){
    runMouse(page); //Simula o movimento do mouse   
    
    //Elementos poluidores
    await page.waitForSelector('#app > div.application--wrap > main > div > div > div > div > div.layout.align-space-around.justify-space-around.row.fill-height > div.flex.mv-material-viewer-main > div.layout.mv-material-viewer-toolbar.align-center.justify-space-between.row.fill-height.mv-viewer-toolbar');
    await page.waitForSelector('#app > div.application--wrap > main > div > div > div > div > div.layout.align-space-around.justify-space-around.row.fill-height > div.flex.mv-material-viewer-main > div.mv-file.mv-content.limitation-bar > div.mv-content-viewer-limitation.mv-file-content-limitation > div');
    await page.waitForSelector('#app > div.application--wrap > main > div > div > div > div > div.layout.align-space-around.justify-space-around.row.fill-height > div.flex.mv-material-viewer-main > div.mv-file.mv-content.limitation-bar > div.mv-material-viewer-container.mv-file-infobar > div.layout.mv-material-viewer-infobar.row.justify-end.wrap.align-end.align-center.visible.absolute');
    await page.waitForSelector('#app > div.application--wrap > main > div > div > div > div > div.layout.align-space-around.justify-space-around.row.fill-height > div.flex.mv-material-viewer-main > div.mv-file.mv-content.limitation-bar > div.mv-material-viewer-container.mv-file-infobar > div.pd-collapse.vertical.show');    
           
    await page.evaluate(() => {        
        let topBar = document.querySelector('#app > div.application--wrap > main > div > div > div > div > div.layout.align-space-around.justify-space-around.row.fill-height > div.flex.mv-material-viewer-main > div.layout.mv-material-viewer-toolbar.align-center.justify-space-between.row.fill-height.mv-viewer-toolbar');
        let rodape = document.querySelector('#app > div.application--wrap > main > div > div > div > div > div.layout.align-space-around.justify-space-around.row.fill-height > div.flex.mv-material-viewer-main > div.mv-file.mv-content.limitation-bar > div.mv-content-viewer-limitation.mv-file-content-limitation > div');        
        let barName = document.querySelector('#app > div.application--wrap > main > div > div > div > div > div.layout.align-space-around.justify-space-around.row.fill-height > div.flex.mv-material-viewer-main > div.mv-file.mv-content.limitation-bar > div.mv-material-viewer-container.mv-file-infobar > div.layout.mv-material-viewer-infobar.row.justify-end.wrap.align-end.align-center.visible.absolute');
        let barBackground = document.querySelector('#app > div.application--wrap > main > div > div > div > div > div.layout.align-space-around.justify-space-around.row.fill-height > div.flex.mv-material-viewer-main > div.mv-file.mv-content.limitation-bar > div.mv-material-viewer-container.mv-file-infobar > div.pd-collapse.vertical.show');        
        
        topBar.parentNode.removeChild(topBar);
        rodape.parentNode.removeChild(rodape);
        barName.parentNode.removeChild(barName);
        barBackground.parentNode.removeChild(barBackground);

        //rodape.innerHTML = "ABC"; //Inseri html no elemento
    });  

    goByPage(page, browser);    
}

openPage('https://www.passeidireto.com/arquivo/44072199/bases-numericas');