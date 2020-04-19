import { observable } from "mobx"

export class TracklistState {
    id = Math.random()
    @observable tracklist = ""

    setTracklist(tracklist: string) {
      this.tracklist = tracklist
    }
}