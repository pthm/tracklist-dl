import dl from 'download-file'
import { Logger } from '../logger';
import utils from 'util'

const dlProm = utils.promisify(dl)

interface ITrackDownload {
  downloadUrl: string
  title: string
  fileName: string
}

export class Downloader {

  downloads: ITrackDownload[]
  downloadPath: string

  constructor(dls: ITrackDownload[], path: string) {
    this.downloads = dls;
    this.downloadPath = path
  }

  async download() {

    for (const download of this.downloads) {
      if (download.downloadUrl) {
        Logger.log(`\tAttempting to download ${download.title}`)
        console.log(`Downloading ${download.title}`);
        try {
          await dlProm(download.downloadUrl, {
            directory: this.downloadPath,
            filename: download.fileName
          })
          Logger.log(`\tDownload for ${download.downloadUrl} succeed`)
          Logger.log(`\tDownload complete!`)
          break;
        } catch (e) {
          Logger.error(e)
          Logger.log(`\tDownload for ${download.downloadUrl} failed, trying next result`)
        }
      } else {
        Logger.log(`\tNo download URL found for ${download.title}`)
      }
    }
  }
}