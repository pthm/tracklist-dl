import React, { FunctionComponent } from 'react'
import { css, cx } from 'emotion'
import { ChooseDownloadPath } from './components/choosePath'
import { Tracklist } from './components/tracklist'
import { observer } from 'mobx-react';
import { state } from './state'

const { ipcRenderer } = window;

const appContainerStyles = css`
  display: flex;
  flex-direction: column;
  background-color: #2D2D2D;
  height: 100%;
`

const downloadButtonStyles = css`
  border: 1px solid #444444;
  padding: 10px;
  background: #2E2E2F;
  color: #CCCCCC;
`

export const App: FunctionComponent = observer(() => {
  return (
    <div className={appContainerStyles}>
      <ChooseDownloadPath />
      <Tracklist />
      <button onClick={() => {
        ipcRenderer.invoke('APP_DOWNLOAD_TRACKLIST', state.tracklist.tracklist, state.downloadPath.downloadPath);
      }} className={downloadButtonStyles}>Download</button>
    </div>
  )
});