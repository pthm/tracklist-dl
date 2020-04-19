import downloadFile from 'download'
import { Logger } from '../logger';

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
          await downloadFile(download.downloadUrl, this.downloadPath, {
            filename: download.fileName,
          })
          Logger.log(`\tDownload for ${download.downloadUrl} succeed`)
          Logger.log(`\tDownload complete!`)
          break;
        } catch (e) {
          Logger.log(`\tDownload for ${download.downloadUrl} failed, trying next result`)
        }
      } else {
        Logger.log(`\tNo download URL found for ${download.title}`)
      }
    }
  }
}