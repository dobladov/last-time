/** @jsx jsx */
import uuidv4 from 'uuid/v4'
import { css, jsx } from '@emotion/core'
import { Plus } from 'react-feather'

const style = css`
  background-color: white;
  max-width: 100vh;
  width: 350px;
  border: 1px solid #DCDEE0;
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: absolute;
  z-index: 1;
  top: calc(100% + 10px);
  left: 10px;

  label {
    padding-bottom: 10px;
    font-size: 1.1rem;
  }

  input {
    width: 100%;
    margin-bottom: 15px;
  }

  &::before {
    position: absolute;
    content: "";
    width: 0;
    height: 0;
    top: -11px;
    left: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #DCDEE0;
  }

  &::after {
    position: absolute;
    content: "";
    width: 0;
    height: 0;
    top: -10px;
    left: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid white;
  }
`
const AddDialog = ({ orderedTasks, addTask, setShowAddDialog }) => {
  return (
    <form css={style} className="AddDialog" onSubmit={(e) => {
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
      addTask(task)
      setShowAddDialog(false)
    }}>

      <label htmlFor="taskName">Task name</label>
      <input required placeholder="Task Name" list="tasksList" id="taskName" name="taskName" />

      <datalist id="tasksList">
        {orderedTasks.map(task => <option key={task.id} value={task.name} />)}
      </datalist>

      <label htmlFor="date">Start Date</label>
      <input type="date" name="date" id="date"/>

      <label htmlFor="date">Start Time</label>
      <input type="time" name="time" id="time"/>

      <div>
        <button
          type="submit"
          className="btn important"
        >
          <Plus />
          Add new task
        </button>
      </div>
    </form>
  )
}

export default AddDialog
