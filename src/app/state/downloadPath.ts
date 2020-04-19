import { observable } from "mobx"

export class DownloadPathState {
    id = Math.random()
    @observable downloadPath = ""

    setDownloadPath(path: string) {
      this.downloadPath = path
    }
}