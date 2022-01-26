import React from "react";
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "components/Appointment/Index";
import useApplicationData from "hooks/useApplicationData";
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay,
} from "helpers/selectors";


export default function Application(props) {
  
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();
  


  const interviewers = getInterviewersForDay(state, state.day);
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const appointmentList = dailyAppointments.map((appointment) => {
    const { id, interview } = appointment;
    const interviewObj = getInterview(state, interview);
    return (
      <Appointment
        key={id}
        {...appointment}
        interview={interviewObj}
        interviewers={interviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            value={state.day}
            onChange={setDay}
            bookInterview={bookInterview}
            cancelInterview={cancelInterview}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentList}
        <Appointment
          key="last"
          time="5pm"
          bookInterview={bookInterview}
          cancelInterview={cancelInterview}
        />
      </section>
    </main>
  );
}
