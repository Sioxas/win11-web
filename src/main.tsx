import React from 'react'
import ReactDOM from 'react-dom'

import WindowsContainer from './core/WindowsContainer'
import { ContextMenuContainer } from './core/ContextMenu'

import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <>
      <WindowsContainer />
      <ContextMenuContainer />
    </>
  </React.StrictMode>,
  document.getElementById('root')
)
