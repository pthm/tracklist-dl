import { WebContents } from "electron";

class GlobalLogger {

  win: WebContents

  setWindow(win: WebContents) {
    this.win = win
  }

  log(...args: string[]) {
    console.log(...args);
    this.win.send("APP_APPEND_TO_LOG", ...args);
  }

}

export const Logger = new GlobalLogger()