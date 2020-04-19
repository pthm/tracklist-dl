import React, { FunctionComponent, useState, useRef, useEffect } from "react";
import { css } from 'emotion';
import { observer } from "mobx-react"

const componentContainerStyles = css`
  box-sizing: border-box;
  padding: 5px;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 33% minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr);
  gap: 1px 1px;
  grid-template-areas: "tracklist log";
`

const tracklistContainerStyles = css`
  grid-area: tracklist;
`

const tracklistStyles = css`
  box-sizing: border-box;
  border: none;
  padding: 5px;
  resize: none;
  margin-right: 2.5px;
  background: #242424;
  color: #ccc;
  width: 100%;
  height: 100%;
`

const logContainerStyles = css`
  grid-area: log;
`

const logStyles = css`
  box-sizing: border-box;
  color: #ccc;
  background: #242424;
  padding: 5px;
  margin-top: 0;
  margin-bottom:0;
  margin-left: 2.5px;
  overflow: scroll;
  tab-size: 2;
  width: 100%;
  height: 100%;
  max-height: 100%;
`

import { state } from "../state"

export const Tracklist: FunctionComponent = observer(() => {

  const logPre = useRef()

  useEffect(() => {
    let el = logPre.current
    //@ts-ignore
    el.scrollTop = el?.scrollHeight
  })

  return (
    <div className={componentContainerStyles}>
      <div className={tracklistContainerStyles}>
        <textarea className={tracklistStyles} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
          state.tracklist.setTracklist(event.target.value)
        }} value={state.tracklist.tracklist} placeholder="Paste your tracklist here"></textarea>
      </div>
      <div className={logContainerStyles}> 
        <pre ref={logPre} className={logStyles}>{state.log.log}</pre>
      </div>
    </div>
  )
})