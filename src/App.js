/** @jsx jsx */
import { Component } from 'react'
import { render } from 'react-dom'
import uuidv4 from 'uuid/v4'
import { Global, css, jsx } from '@emotion/core'
import { DateTime } from 'luxon'

import globalStyles from './globalStyles'
import DateDisplay from './DateDisplay'

const style = css`
  main {
    padding: 20px;
  }

  .task {
    border: 2px solid #5b626a;
    margin-top: 20px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    position: relative;

    .taskInfo {
      flex: 2 400px;
      padding-bottom: 10px;

      h2 {
        padding: 0;
        margin: 0;
        display: inline-block;
      }

      .taskFulldate {
        display: inline-block;
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
      flex: 1 200px;

      text-align: center;
      input {
        margin-right: 5px;

        :last-child {
          margin-right: 0;
        }
      }
    }

    .taksPercentage {
      position: absolute;
      width: 100%;
      height: 5px;
      /* border-top: 1px solid #5b626a; */
      background-color: mediumspringgreen;
      left: 0;
      bottom: 0;
    }

    @media (min-width: 768px) {

    }
  }

  .add {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    input {
      flex: 1 200px;
      margin-bottom: 5px;

      :last-child {
        margin-right: 0;
      }
    }
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
      tasks: getTasks()
    }
  }

  render () {
    const { tasks } = this.state

    const orderedTasks = orderTasks(tasks)
    const min = (orderedTasks.length && orderedTasks[0].date.getTime()) || 0
    const max = (orderedTasks.length && orderedTasks[orderedTasks.length - 1].date.getTime()) || 0

    return (
      <div className="wrapper" css={style}>
        <Global styles={globalStyles} />
        <main>
          <form className="add" onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.target)
            const name = formData.get('taskName')
            const date = formData.get('date')
            const time = formData.get('time')

            const task = {
              id: uuidv4(),
              name: name
            }

            if (date && time) {
              const [year, month, day] = date.split('-')
              const [hours, minutes] = time.split(':')
              task.date = new Date(year, month, day, hours, minutes)
            } else if (!date && time) {
              const date = new Date()
              const [hours, minutes] = time.split(':')
              task.date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes)
            } else if (date && !time) {
              task.date = new Date(date)
            } else {
              task.date = new Date()
            }

            e.target.reset()
            const newTasks = tasks.concat(task)
            this.setState({ tasks: newTasks }, () => {
              localStorage.setItem('tasks', JSON.stringify(newTasks))
            })
          }}>
            <input required placeholder="Task Name" list="tasksList" id="taskName" name="taskName" />

            <datalist id="tasksList">
              {orderedTasks.map(task => <option key={task.id} value={task.name} />)}
            </datalist>

            <input type="date" name="date" id="date"/>
            <input type="time" name="time" id="time"/>

            <input type="submit" value="Add"/>
          </form>
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
                <input
                  type="button"
                  value="Delete"
                  onClick={() => {
                    const newTasks = tasks.filter(t => t.id !== task.id)
                    this.setState({ tasks: newTasks }, () => {
                      localStorage.setItem('tasks', JSON.stringify(newTasks))
                    })
                  }}
                />
                <input
                  type="button"
                  value="Update"
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
                />
              </div>
              <div className="taksPercentage" style={{ width: `${calculatePercentage(task.date.getTime(), min, max, 100, 0)}%` }} />
            </div>
          ))}
        </main>
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'))
