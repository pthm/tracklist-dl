import { SearchProvider, ITrackSearchResult } from "../searcher";
import cheerio from 'cheerio';
import * as zsExtract from 'zs-extract';
import async from 'async';
import { BrowserWindow, ipcMain } from "electron";
import path from 'path';
import { Logger } from "../../logger";
import got from 'got';

interface IZippySearchResult {
  title: string
  zippyshareUrl: string
}

interface IZippyDownloadURL {
  url: string;
  fileName: string;
}

export class ZippySearcher extends SearchProvider {

  name: string = 'zippysharesearch.info'

  async init() {
    try {
      const response = await got.get("https://zippyshare.com")
      if (response.statusCode != 200) {
        throw new Error("Can't connect to Zippyshare, try using a VPN")
      }
    } catch(e) {
      throw new Error("Can't connect to Zippyshare, try using a VPN")
    }
  }

  async search(title: string): Promise<ITrackSearchResult[]> {
    const zippySearchResults = await this.getZippySearchResults(title)
    return await this.zippyToTrackSearchResults(zippySearchResults)
  }
  
  private async getZippySearchResults(trackTitle: string): Promise<IZippySearchResult[]> {
    return new Promise(async resolve => {
      const results: IZippySearchResult[] = [];
      const url = `https://zippysharesearch.info/?q=${trackTitle}`;
      const window = new BrowserWindow({
        show: false,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          enableRemoteModule: false,
          preload: path.join(__dirname, "preload.js")
        }
      })
      await window.loadURL(url)
      Logger.log(`\tLoaded results page at ${url}`)
      ipcMain.on('APP_ZIPPY_RESULTS_HTML', async (event, html) => {
        const $ = cheerio.load(html, { _useHtmlParser2: true });
        $('.gsc-webResult').each(function(idx, element) {
          const title = $(element)
            .find('a.gs-title')
            .first()
            .text();
          const zippyshareUrl = $(element)
            .find('div.gs-visibleUrl-long')
            .first()
            .text();
          results.push({
            title,
            zippyshareUrl,
          });
        });
        resolve(
          results.filter(res => {
            return res.title !== '' && res.zippyshareUrl !== '';
          })
        );
        try {
          window.close()
        } catch (e) {}
      });
      const code = `
        window.ipcRenderer.send('APP_ZIPPY_RESULTS_HTML', document.documentElement.innerHTML);
      `
      window.webContents.executeJavaScript(code)
    });
  }

  private async getZippyDownloadURL(result: IZippySearchResult): Promise<IZippyDownloadURL> {
    try {
      const url = await zsExtract.extract(result.zippyshareUrl)
      return {
        fileName: url.filename,
        url: url.download
      }
    } catch(e) {
      throw e
    }
  }

  private async zippyToTrackSearchResults(results: IZippySearchResult[]): Promise<ITrackSearchResult[]> {
    let searchResults: ITrackSearchResult[] = []
    return new Promise((resolve, reject) => {
      async.eachLimit(results, 2, async (result, callback) => {
        try {
          const download = await this.getZippyDownloadURL(result)
          searchResults.push({
            downloadUrl: download.url,
            title: result.title,
            fileName: download.fileName,
          })
          Logger.log(`\tExtracted Zippyshare download URL for ${result.zippyshareUrl}`)
          callback();
        } catch(e) {
          Logger.log(`\tCouldn't get Zippyshare URL for ${result.zippyshareUrl}`)
          callback()
        }
      }, () => {
        resolve(searchResults)
      })
    })
  }

}