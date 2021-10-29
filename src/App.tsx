import { useState } from 'react'

import Desktop from './desktop'

import './App.css'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Desktop />
    </>
  )
}
