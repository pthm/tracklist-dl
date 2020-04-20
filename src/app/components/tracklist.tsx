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
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr) 45px;
  grid-template-areas: "input" "controls";
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

const inputContainerStyles = css`
  grid-area: input;
`

const controlsContainerStyles = css`
  box-sizing: border-box;
  padding-top: 5px;
  color: #ccc;
  grid-area: controls;
`

const logContainerStyles = css`
  grid-area: log;
`

const controlButton = css`
  border: 1px solid #444444;
  background: #2E2E2F;
  margin-right: 3px;
  color: #CCCCCC;
  flex: 1;
  height: 25px;
  :hover {
    color: white;
    background: #1F8AD2;
  }
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

  const replaceInLines = (expr: RegExp, replace: string = '') => {
    const tl = state.tracklist.tracklist;
    const lines = tl.split('\n');
    const newLines = []
    for(const line of lines) {
      newLines.push(line.replace(expr, '').trim())
    }
    state.tracklist.setTracklist(newLines.join('\n'))
  }

  const removeTrackNumbers = () => {
    replaceInLines(/^[0-9]*\.?\s?/)
  }

  const removeSquareBrackets = () => {
    replaceInLines(/\[[^\]]*\]/g)
  }

  return (
    <div className={componentContainerStyles}>
      <div className={tracklistContainerStyles}>
        <div className={inputContainerStyles}>
          <textarea className={tracklistStyles} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            state.tracklist.setTracklist(event.target.value.split('\n').map(l => l.trim()).filter(l => l != '').join('\n'))
          }} value={state.tracklist.tracklist} placeholder="Paste your tracklist here"></textarea>
        </div>
        <div className={controlsContainerStyles}>
          <button className={controlButton} onClick={() => {
            removeTrackNumbers()
          }}>Remove Track Numbers</button>
          <button className={controlButton} onClick={() => {
            removeSquareBrackets()
          }}>Remove Square Brackets</button>
        </div>
      </div>
      <div className={logContainerStyles}> 
        <pre ref={logPre} className={logStyles}>{state.log.log}</pre>
      </div>
    </div>
  )
})