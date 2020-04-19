import React, { FunctionComponent } from 'react'
import { css, cx } from 'emotion'
import { ChooseDownloadPath } from './components/choosePath'
import { Tracklist } from './components/tracklist'
import { observer } from 'mobx-react';
import { state } from './state'

const { ipcRenderer } = window;

const appContainerStyles = css`
  background-color: #2D2D2D;
  height: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: 40px minmax(0, 1fr) 60px;
  gap: 1px 1px;
  grid-template-areas: "browse" "main" "download";
`

const downloadButtonStyles = css`
  border: 1px solid #444444;
  padding: 10px;
  background: #2E2E2F;
  color: #CCCCCC;
  grid-area: download;
  :hover {
    color: white;
    background: #1F8AD2;
  }
`

const browse = css`
  grid-area: browse;
`

const main = css`
  grid-area: main;
`

export const App: FunctionComponent = observer(() => {
  return (
    <div className={appContainerStyles}>
      <div className={browse}>
        <ChooseDownloadPath />
      </div>
      <div className={main}>
        <Tracklist />
      </div>
      <button onClick={() => {
        ipcRenderer.invoke('APP_DOWNLOAD_TRACKLIST', state.tracklist.tracklist, state.downloadPath.downloadPath);
      }} className={downloadButtonStyles}>Download</button>
    </div>
  )
});