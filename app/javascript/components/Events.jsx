import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Filters from './Filters'
import EventModal from './EventModal'
import EventCalendar from './EventCalendar'
import styled from 'styled-components'
import volunteer_placeholder from '../../assets/images/volunteer_placeholder'

const Events = () => {
  const initalQueryParams = new URLSearchParams(location.search)
  const [results, setResults] = useState([]) // order matters in arrays
  const [user, setUser] = useState({})
  const [filters, setFilters] = useState({
    ...(initalQueryParams.get('location') && {
      city_state: initalQueryParams.get('location')
    }),
    ...(initalQueryParams.get('category') && {
      category: initalQueryParams.get('category')
    })
  }) //Object BC it holds a lot of keys and orders don't matter
  const [calendarView, setCalendarView] = useState(false)
  const [modalInfo, setModalInfo] = useState({})
  useEffect(() => {
    fetchEventData()
  }, []) //the empty brakets are dependency arrays, used to break the infinite loop, and only make axios run one
  const openModalToggle = result => {
    setModalInfo(result)
  }
  const closeModalToggle = result => {
    setModalInfo({})
  }
  const getQueryParams = filters =>
    Object.keys(filters).reduce(
      (acc, param) =>
        acc
          ? `${acc}&${param}=${filters[param]}`
          : `${param}=${filters[param]}`,
      ''
    )
  const fetchEventData = () => {
    const queryParams = getQueryParams(filters)
    axios
      .get(`/events.json?${queryParams}`)
      .then(response => {
        console.log(response)
        setResults(response.data.all_data.events)
        setUser(response.data.all_data.user)
      })
      .catch(error => {
        console.log(error.response)
      })
  }
  // partial applycation = type of function
  // curried = partial application + the other partial application aka double rockets
  const handleFilterSelect = filterType => event => {
    const updatedFilter = { ...filters, [filterType]: event.target.value }
    setFilters(updatedFilter)
    const queryParams = getQueryParams(updatedFilter)
    axios
      .get(`/events.json?${queryParams}`)
      .then(response => setResults(response.data.all_data.events))
  }
  const handleThumbnailView = () => {
    setCalendarView(false)
  }
  const handleCalendarView = () => {
    setCalendarView(true)
  }
  const handleViewMore = event => Turbolinks.visit(`/events/${event.id}`)
  // spread opperator to map through the filters and maintain them
  //"" [filterType]: "" this is known as a dynamic property, you can pass a string or number
  // and it will assign that property on the object aka first argument on the rocket train
  // and the value of that property would be whatever we selected on the select tag.
  return (
    <>
      {calendarView === false ? (
        <>
          <div className="hero_image">
            <div className="filters_bar">
              <>
                <Filters
                  handleFilterSelect={handleFilterSelect}
                  filters={filters}
                  setFilters={setFilters}
                />
              </>
              <div class="viewTypes">
                <button id="thumbnailView" onClick={handleThumbnailView}>
                  <h2 class="view_button">Thumbnail View</h2>
                </button>
                <button onClick={handleCalendarView} id="calendarView">
                  <h2 class="view_button">Calendar View</h2>
                </button>
              </div>
            </div>
          </div>
          <div className="cards_container">
            {results.map(result => (
              <div
                className="card"
                key={result.id}
                data-toggle="modal"
                data-target="#exampleModal"
                onClick={() => openModalToggle(result)}
              >
                <div class="flip-card">
                  <div class="flip-card-inner">
                    <div class="flip-card-front">
                      <div class="event-card-photo">
                        <img
                          src={volunteer_placeholder}
                          className="volunteer_placeholder"
                        />
                      </div>
                      <div class="card_text">
                        <div class="card_event_date">{result.date}</div>
                        <div class="card_event_name">{result.name}</div>
                        <div class="card_footer">
                          <div class="card_event_city">{result.city_state}</div>
                        </div>
                      </div>
                    </div>
                    <div class="flip-card-back">
                      <div class="card-back-text">
                        <p class="card_event_about">{result.about} </p>
                        <div class="card_back_footer">Read More</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <EventModal
              name={modalInfo.name}
              about={modalInfo.about}
              id={modalInfo.id}
              user_id = {user.id}
              handleViewMore={() => handleViewMore(modalInfo)}
              closeModalToggle={closeModalToggle}
            />
          </div>
        </>
      ) : (
        <>
          <div class="hero_image">
            <div class="filters_bar">
              {' '}
              <>
                <Filters
                  handleFilterSelect={handleFilterSelect}
                  filters={filters}
                  setFilters={setFilters}
                />
              </>{' '}
              <div class="viewTypes">
                <button id="thumbnailView" onClick={handleThumbnailView}>
                  <h2 class="view_button">Thumbnail View</h2>
                </button>
                <button onClick={handleCalendarView} id="calendarView">
                  <h2 class="view_button">Calendar View </h2>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          width:"100%",
          display:"flex",
          justifyContent:"center",
          alignItems:"center"
        }}>
      
      <EventCalendar modal={modalInfo} />
      </div>
      </>
          <p>Calendar view</p>
          <EventCalendar />
        </>
      )}
    </>
  )
}
export default Events
