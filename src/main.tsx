import React from 'react'
import ReactDOM from 'react-dom'

import 'reflect-metadata';

import Windows from './core/Windows'

import './index.css'

ReactDOM.render(
  <React.StrictMode>
    <Windows />
  </React.StrictMode>,
  document.getElementById('root')
)
