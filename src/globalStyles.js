import { css } from '@emotion/core'

const globalStyles = css`
  html {
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: #fafafa;
    font-size: 16px;
    font-family: futura-pt, sans-serif, sans-serif;
    color: #3c3c3c;
    min-height: 100vh;
  }

  button, input, textarea, select {
    padding: 8px;
    background: transparent;
    border: 2px solid #5b626a;
    border-radius: 0;
    outline: none;
    font-size: 100%;

    &:hover {
      background-color: #5b626a;
      color: #fafafa;
    }
  }
`

export default globalStyles
