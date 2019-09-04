import React from 'react'
import PropTypes from 'prop-types'
import { DateTime, Interval } from 'luxon'

const getIntervalFromNow = (date) => {
  const future = isFuture(date)
  return [
    Interval.fromDateTimes(future ? DateTime.local() : date, future
      ? date : DateTime.local()).toDuration(['hours', 'minutes', 'seconds', 'days', 'months', 'years']).toObject(),
    future
  ]
}

const isFuture = (date) => {
  return DateTime.local() - date < 0
}

class DateDisplay extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      dateObj: props.date,
      future: isFuture(props.date)
    }
    this.updateIntervals = this.updateIntervals.bind(this)
  }

  componentDidMount () {
    this.updateIntervals()
  }

  componentWillUnmount () {
    window.cancelAnimationFrame(this.updateID)
  }

  updateIntervals () {
    const { date } = this.props

    const [dateObj, future] = getIntervalFromNow(date)

    this.setState({ dateObj, future })
    this.updateID = window.requestAnimationFrame(this.updateIntervals)
  }

  render () {
    const { dateObj, future } = this.state

    return (
      <span className="taskDate">
        {Object.keys(dateObj).map(key => (
          dateObj[key] > 0 && <span className={future ? 'future' : ''} key={key} >{key.charAt(0).toUpperCase() + key.slice(1)} {key === 'seconds' ? Math.floor(dateObj[key]) : dateObj[key]}</span>
        ))}
      </span>
    )
  }
}

DateDisplay.propTypes = {
  date: PropTypes.instanceOf(Date)
}

export default DateDisplay
