const puppeteer = require('puppeteer')            
var merge = require('easy-pdf-merge');
var CaptureCookies = require('./CaptureCookies');

class BrowserAutomator{
    constructor(formato, interval, sessionOn, url){
        this.url = url;                
        this.titulo = '';
        this.numMaxPages = '';
        this.formato = formato;
        this.interval = interval;     
        this.sessionOn = sessionOn;   
        this.catchCookies = new CaptureCookies(); 
    }    
    async openPage(){        
        //const browser = await puppeteer.launch();   //Modo handler
        const browser = await puppeteer.launch({ headless: false });     //Modo browser chrome nativo
        
        var page = await browser.newPage();         
        await page.goto(this.url);    
        
        this.titulo = await page.title();
        console.log(this.titulo);        
        this.getTotalPages(page);    
        this.inserirCokies(page, browser, this.url);
    }    
    async getTotalPages(page){
        const element = await page.$(".page-count");
        const text = await page.evaluate(element => element.textContent, element);
        var numString = text.replace(/[^0-9]/g,'');             
        this.numMaxPages = parseInt(numString);          
        console.log("Number pages: ", this.numMaxPages);
    }
    async inserirCokies(page, browser, url){        
        
        this.catchCookies.run(url, browser, this.sessionOn);        
        //Espera o processo de autenticação e inserção de cookies serem concluídos;
        var cont = 0;
        while(!this.catchCookies.prosseguir){                  
            await page.waitFor(1000);              
            console.log('Esperando liberação: ',cont++,' s');
            console.log('Prosseguir: ',this.catchCookies.prosseguir);
        }
                
        console.log('Processeguindo... Cookies inseridos!!!!!')
        this.openTabs(this.catchCookies.pageHeadless, browser);
    }
    
    async openTabs(page, browser){
        this.modifyElements(page, browser, 1);
                
        for(var pageStart=1; pageStart<=this.interval; pageStart++){
            var pageSecond = page;        
            pageSecond = await browser.newPage();                
            await pageSecond.goto(this.url);        
            this.modifyElements(pageSecond, browser, pageStart);            
        }        
    }  
    async modifyElements(page, browser, startPage){
        this.runMouse(page); //Simula o movimento do mouse   
        
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

        this.goByPage(page, browser, startPage); 
    }
    async runMouse(page){
        var cont = 0;
        while(cont < 1000){
            await page.mouse.move(100, 100);        
            await page.mouse.move(200, 200);             
            await page.waitFor(1000);              
            console.log(cont++);
        }
    }      

    async goByPage(page, browser, nPage){              
        //Espera o seletor ser carregado
        await page.waitForSelector('#app > div.application--wrap > main > div > div > div > div > div.layout.align-space-around.justify-space-around.row.fill-height > div.flex.mv-material-viewer-main > div.mv-file.mv-content.limitation-bar > div.mv-file-contents > div > div > div.file-viewer-navigator > div > div.pages-info > input[type="number"]')
        
        //Contadores de páginas                
        var nPageMax = this.numMaxPages;
        var qtdBackspace = 1;
        var tenMultiple = 10;
        while(nPage <= nPageMax){                    
            
            //Clica no campo
            await page.click('#app > div.application--wrap > main > div > div > div > div > div.layout.align-space-around.justify-space-around.row.fill-height > div.flex.mv-material-viewer-main > div.mv-file.mv-content.limitation-bar > div.mv-file-contents > div > div > div.file-viewer-navigator > div > div.pages-info > input[type="number"]');   
            
            //Apaga e inseri o nº da pág. e depois 3 segundos vai para próxima.        
            for(var nPress=1; nPress<=qtdBackspace; nPress++){
                await page.keyboard.press('Backspace');        
            }
            
            await page.keyboard.type(nPage.toString());
            await page.waitFor(3000);     // Tempo para que que todos os elemento da página carrege      
            this.getPage(page, nPage);
            await page.waitFor(2000);   // Tempo para que o método getPage gere o pdf.        
            
            if(nPage==tenMultiple){
                qtdBackspace++;
                tenMultiple = tenMultiple*10;
            }
            nPage = nPage + this.interval;
        }    
        if(nPage-this.interval == nPageMax){
           this.mergePDFs(this.titulo, nPageMax, browser);
        }        
    }
    async getPage(page, nPage){
        await page.emulateMedia('screen');
        var path = 'temp/pag. '+ nPage.toString()+'.pdf';
        //await page.screenshot({path: path});
        await page.pdf({path: path, format: this.formato});              
    }     
    async closePage(browser){
        await browser.close(); 
        console.log("Procedimento finalizado!");    
    } 
    mergePDFs(titlePage, nMaxPage, browser){        
        var dest_file = titlePage+'.pdf';
        var nPagesMax = nMaxPage;
        var source_files = [];
        for(var n=1; n<=nPagesMax; n++){
            source_files.push('temp/pag. '+ n +'.pdf');
        }
        console.log(source_files);

        merge(source_files,dest_file,function(err){
            if(err)
            return console.log(err);
            console.log('Successfully merged pages!');
        });
        if(this.sessionOn){
            this.closePage(browser);
        }        
    }
}
module.exports = BrowserAutomator;
