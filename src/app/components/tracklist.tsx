import React, { FunctionComponent, useState } from "react";
import { css } from 'emotion';
import { observer } from "mobx-react"

const tracklistContainerStyles = css`
  padding: 5px;
  display: flex;
  flex-direction: row;
  flex: 1;
  max-height: 92.6%;
`

const tracklistStyles = css`
  flex: 1;
  border: none;
  padding: 5px;
  margin-right: 2.5px;
  background: #242424;
  color: #ccc;
`

const logStyles = css`
  flex: 2;
  color: #ccc;
  background: #242424;
  padding: 5px;
  margin-top: 0;
  margin-bottom:0;
  margin-left: 2.5px;
  overflow: scroll;
  tab-size: 2;
  max-height: 100%;
`

import { state } from "../state"

export const Tracklist: FunctionComponent = observer(() => {
  return (
    <div className={tracklistContainerStyles}>
      <textarea className={tracklistStyles} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
        state.tracklist.setTracklist(event.target.value)
      }} value={state.tracklist.tracklist} placeholder="Paste your tracklist here"></textarea>
      <pre className={logStyles}>{state.log.log}</pre>
    </div>
  )
})