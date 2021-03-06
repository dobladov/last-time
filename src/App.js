/** @jsx jsx */
import { Component } from 'react'
import { render } from 'react-dom'
import { Global, css, jsx } from '@emotion/core'
import { DateTime } from 'luxon'
import uuidv4 from 'uuid/v4'

import globalStyles from './globalStyles'
import DateDisplay from './DateDisplay'
import AddDialog from './AddDialog'

import { Plus, Upload, Download, Clock, Trash2, Minus } from 'react-feather'

import logo from './assets/logo.svg'

const style = css`
  main {
    padding: 20px;
  }

  .logoContaienr {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;

    img {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
  }

  .controls {
    justify-content: space-between;
    align-items: center;

    & h1 {
      display: inline-block;
      margin: 0;
      font-weight: 300;
      font-size: 2rem;
    }

    .buttonsContainer {
      flex: 1;
      display: flex;
      justify-content: space-evenly;

      & > button {
        margin-right: 10px;
      }
    }
  }

  @media (min-width: 576px) {
    main {
      padding: 40px;
    }

    .logoContaienr {
      margin-bottom: 0;
    }
    
    .controls {
      display: flex;

      .buttonsContainer {
        justify-content: flex-end;
      }
    }
  }

  .tasks {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    margin-top: 20px;
  }

  .task {
    border: 1px solid #DCDEE0;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    position: relative;
    background: white;

    .taskInfo {
      flex: 2 400px;
      padding-bottom: 10px;

      h2 {
        padding: 0;
        margin: 0;
        display: inline-block;
        font-weight: 400;
        font-size: 1.8rem;
      }

      .taskFulldate {
        position: absolute;
        right: 10px;
        top: 10px;
        margin-left: 10px;
        font-size: .8rem;
        color: #686868;
      }

      .taskDate {
        span {
          margin-right: 5px;
        }

        .future {
          color: tomato;
        }
      }
    }

    .taskControls {
      display: flex;
      justify-content: space-evenly;
      width: 100%;

      button {
        font-size: .8rem;

        svg {
          margin-right: 5px;
          height: 17px;
        }
      }

    }

    .taskDate {
      display: flex;
      justify-content: space-around;
      margin: 10px 0;

      .dateBlock {
        text-align: center;
        margin-right: 10px;
      }
    }

    .taksPercentage {
      position: absolute;
      width: 100%;
      height: 5px;
      background: rgba(0, 0, 0, 0) linear-gradient(rgb(49, 182, 169) 0%, rgb(72, 190, 178) 100%) repeat scroll 0% 0%;

      left: 0;
      bottom: 0;
    }
  }

  .addWrapper {
    position: relative;
  }
`

const orderTasks = (tasks) => {
  return tasks.sort((a, b) => a.date - b.date)
}

const getTasks = () => {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || []
  return tasks.map(task => {
    task.date = new Date(task.date)
    return task
  })
}

const calculatePercentage = (num, inMin, inMax, outMin, outMax) => {
  return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
}

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showAddDialog: false,
      tasks: getTasks()
    }
    this.addTask = this.addTask.bind(this)
    this.setShowAddDialog = this.setShowAddDialog.bind(this)
  }

  addTask (task) {
    const { tasks } = this.state
    const newTasks = tasks.concat(task)
    this.setState({ tasks: newTasks }, () => {
      localStorage.setItem('tasks', JSON.stringify(newTasks))
    })
  }

  setShowAddDialog (bool) {
    this.setState({ showAddDialog: bool })
  }

  render () {
    const { tasks, showAddDialog } = this.state
    const { addTask } = this

    const orderedTasks = orderTasks(tasks)
    const min = (orderedTasks.length && orderedTasks[0].date.getTime()) || 0
    const max = (orderedTasks.length && orderedTasks[orderedTasks.length - 1].date.getTime()) || 0

    return (
      <div className="wrapper" css={style}>
        <Global styles={globalStyles} />
        <main>

          <section className="controls">
            <div className="logoContaienr">
              <img src={logo} alt="Logo"/>
              &nbsp;
              <h1>Last Time</h1>
            </div>

            <div className="buttonsContainer">
              <button
                className="btn"
                onClick={() => {
                  const upload = document.createElement('input')
                  upload.type = 'file'
                  upload.accept = 'text/json'
                  upload.click()
                  upload.addEventListener('change', (e) => {
                    const file = e.target.files[0]
                    var reader = new FileReader()
                    reader.readAsText(file, 'UTF-8')
                    reader.onload = function (evt) {
                      const tasks = JSON.parse(evt.target.result) || []
                      const newTaskWithDates = tasks.map(task => {
                        task.date = new Date(task.date)
                        task.id = uuidv4()
                        return task
                      })
                      addTask(newTaskWithDates)
                    }
                  })
                }}
              >
                <Upload />
                Import
              </button>
              <button
                className="btn"
                onClick={() => {
                  const exportData = JSON.stringify(orderedTasks)
                  console.log(exportData)
                  const link = document.createElement('a')
                  link.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(exportData))
                  link.setAttribute('download', `export-${new Date().toISOString()}.txt`)
                  link.style.display = 'none'
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                }}
              >
                <Download
                />
                Export
              </button>

              <div className="addWrapper">
                <button
                  className="btn important"
                  onClick={() => {
                    this.setShowAddDialog(!showAddDialog)
                  }}
                >
                  {showAddDialog ? <Minus /> : <Plus />}
                  <span>{showAddDialog ? 'Hide' : 'New'}</span>
                </button>

                {showAddDialog && (
                  <AddDialog
                    addTask={this.addTask}
                    orderedTasks={orderedTasks}
                    setShowAddDialog={this.setShowAddDialog}
                  />
                )}
              </div>
            </div>

          </section>

          <section className="tasks">

            {orderedTasks.map(task => (
              <div key={task.id} className="task">
                <div className="taskInfo">
                  <div>
                    <h2>{task.name}</h2>
                    <span className="taskFulldate">
                      {DateTime.fromJSDate(task.date).toFormat('yyyy LLL dd')}
                    </span>
                  </div>
                  <DateDisplay date={task.date} />
                </div>
                <div className="taskControls">
                  <button
                    className="btn"
                    type="button"
                    onClick={() => {
                      const newTasks = tasks.filter(t => t.id !== task.id)
                      this.setState({ tasks: newTasks }, () => {
                        localStorage.setItem('tasks', JSON.stringify(newTasks))
                      })
                    }}
                  >
                    <Trash2 />
                    Delete
                  </button>
                  <button
                    className="btn"
                    type="button"
                    onClick={() => {
                      const newTasks = tasks.map(t => {
                        if (t.id === task.id) {
                          t.date = new Date()
                        }
                        return t
                      })

                      this.setState({ tasks: newTasks }, () => {
                        localStorage.setItem('tasks', JSON.stringify(newTasks))
                      })
                    }}
                  >
                    <Clock />
                    Update
                  </button>
                </div>
                <div className="taksPercentage" style={{ width: `${calculatePercentage(task.date.getTime(), min, max, 100, 0)}%` }} />
              </div>
            ))}
          </section>
        </main>
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'))
