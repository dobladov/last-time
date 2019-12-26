import React from 'react'
import uuidv4 from 'uuid/v4'

const AddDialog = ({ orderedTasks, addTask }) => {
  console.log("asdads")
  return (
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
      addTask(task)
      // const newTasks = tasks.concat(task)
      // this.setState({ tasks: newTasks }, () => {
      //   localStorage.setItem('tasks', JSON.stringify(newTasks))
      // })
    }}>
      <input required placeholder="Task Name" list="tasksList" id="taskName" name="taskName" />

      <datalist id="tasksList">
        {orderedTasks.map(task => <option key={task.id} value={task.name} />)}
      </datalist>

      <input type="date" name="date" id="date"/>
      <input type="time" name="time" id="time"/>

      <input type="submit" value="Add"/>
    </form>
  )
}

export default AddDialog
