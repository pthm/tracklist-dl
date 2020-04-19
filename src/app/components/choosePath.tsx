import React, { FunctionComponent, useState } from 'react'
import { css, cx } from 'emotion'
import { state } from '../state'
import { observer } from 'mobx-react';

const { ipcRenderer } = window;

const chooseDownloadPathStyles = css`
  flex: 0;
  padding: 5px 10px;
  height: 30px;
  background: #242424;
  color: #CCCCCC;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const labelStyle = css`
  flex: 0;
  min-width: 120px;
`

const inputStyle = css`
  background: #3B3B3C;
  border: 1px solid #444444;
  flex: 8;
  margin-right: 5px;
  padding: 2px;
  color: #CCCCCC;
`

const buttonStyle = css`
  border: 1px solid #444444;
  background: #2E2E2F;
  color: #CCCCCC;
  flex: 1;
`

export const ChooseDownloadPath: FunctionComponent = observer(() => {
  ipcRenderer.on('APP_CHOSEN_DOWNLOAD_PATH', data => {
    console.log('Received chosen download path', data);
    state.downloadPath.setDownloadPath(data.paths[0]);
  })

  return (
    <div className={chooseDownloadPathStyles}>
      <div className={labelStyle}>Download Path:</div>
      <input className={inputStyle} type="text" readOnly={true} value={state.downloadPath.downloadPath}></input>
      <button className={buttonStyle} onClick={() => {
        ipcRenderer.invoke('APP_CHOOSE_DOWNLOAD_PATH');
      }}>Choose</button>
    </div>
  )
})