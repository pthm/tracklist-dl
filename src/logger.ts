import { WebContents } from "electron";

class GlobalLogger {

  win: WebContents
  queue: string[][] = []

  constructor() {
    setInterval(() => {
      if (this.queue.length > 0) {
        this.log(...this.queue.pop())
      }
    }, 500)
  }

  setWindow(win: WebContents) {
    this.win = win
  }

  log(...args: string[]) {
    console.log(...args);
    try {
      this.win.send("APP_APPEND_TO_LOG", args.join(' '));
    } catch (e) {
      this.queue.push(args)
    }
  }

  warn(...args: string[]) {
    this.log('WARN:', ...args)
  }

  info(...args: string[]) {
    this.log('INFO:', ...args)
  }

  verbose(...args: string[]) {
    this.log('VERBOSE:', ...args)
  }

  debug(...args: string[]) {
    this.log('DEBUG:', ...args)
  }

  silly(...args: string[]) {
    this.log('SILLY:', ...args)
  }

  error(...args: string[]) {
    this.log('ERROR:', ...args)
  }
}

export const Logger = new GlobalLogger()