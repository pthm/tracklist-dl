import { LogState } from "./log";
import { TracklistState } from "./tracklist";
import { DownloadPathState } from "./downloadPath";

export const state = {
  log: new LogState(),
  tracklist: new TracklistState(),
  downloadPath: new DownloadPathState(),
}