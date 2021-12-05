import React, { useState, useEffect } from 'react'
import * as ReactDOM from 'react-dom'
import { DateTime } from 'luxon'
import { Router, Switch, Route } from 'wouter'
import Calendar from './Calendar'
import Day from './Day'
import './App.css'

const currentLocation = () => {
  return window.location.hash.replace(/^#/, '') || '/'
}

const navigate = (to) => (window.location.hash = to)

const useHashLocation = () => {
  const [loc, setLoc] = useState(currentLocation())

  useEffect(() => {
    // this function is called whenever the hash changes
    const handler = () => setLoc(currentLocation())

    // subscribe to hash changes
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  return [loc, navigate]
}

function App () {
  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route exact path='/:year/:month/'>
          {({ month, year }) => <Calendar year={year} month={month} />}
        </Route>
        <Route exact path='/:year/:month/:day/'>
          {({ month, year, day }) => (
            <Day year={year} month={month} day={day} />
          )}
        </Route>
        <Route exact path='/today'>
          <Day
            year={DateTime.local().year}
            month={DateTime.local().month}
            day={DateTime.local().day}
          />
        </Route>
        <Route>
          <Calendar
            year={DateTime.local().year}
            month={DateTime.local().month}
          />
        </Route>
      </Switch>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
