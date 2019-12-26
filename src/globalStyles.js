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
    background-color: #F1F3F6;
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
    background: white;
    border: 1px solid #8997AE;
    color: #8997AE;

    &:hover {
      background-color: #8997AE;
      color: white;
    }
  }

  .btn {
    color: #8997AE;
    font-weight: bold;
    border: none;
    display: inline-flex;
    align-items: center;
    background: white;
    border: 1px solid #8997AE;
    padding: 10px;
    border-radius: 10px;
    font-weight: 500;

    & > svg {
      margin-right: 10px;
    }

    &.important {
      border: 1px solid rgb(41, 56, 69);
      color: white;
      background-color: rgb(41, 56, 69);

      &:hover {
        background-color: #25313D;
      }
    }
  }
`

export default globalStyles
