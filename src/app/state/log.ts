import { observable } from "mobx"
const { ipcRenderer } = window;

export class LogState {
  constructor() {
    ipcRenderer.on("APP_APPEND_TO_LOG", (...lines: string[]) => {
      console.log("Append to log", lines)
      for(const line of lines) {
        this.appendToLog(line)
      }
    })
  }

  appendToLog(line: string) {
    this.log = this.log.concat(line, "\n")
  }

  id = Math.random()
  @observable log = ""
}