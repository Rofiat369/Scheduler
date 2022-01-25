import React, { useState, useEffect } from "react";
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "components/Appointment";
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay,
} from "helpers/selectors";
import axios from "axios"; //helps us make http requests

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  //function to book interview
  function bookInterview(appointmentId, interviewObj) {
    const newAppointment = {
      ...state.appointments[appointmentId],
      interview: interviewObj,
    };

    const newAppointments = {
      ...state.appointments,
      [appointmentId]: newAppointment,
    };

    return axios
      .put(`/api/appointments/${appointmentId}`, newAppointments[appointmentId])
      .then(setState({ ...state, appointments: newAppointments }));
  }

  //function to delete interview
  function cancelInterview(appointmentId) {
    const deletedAppointment = {
      ...state.appointments[appointmentId],
      interview: null,
    };

    const deletedAppointments = {
      ...state.appointments,
      [appointmentId]: deletedAppointment,
    };

    return axios
      .delete(
        `/api/appointments/${appointmentId}`,
        deletedAppointments[appointmentId]
      )
      .then(setState({ ...state, appointments: deletedAppointments }));
  }

  //function to edit interview
  function editInterview(appointmentId, interviewObj){
    const editedAppointment = {
      ...state.appointments[appointmentId],
      interview: interviewObj,
    };

    const editedAppointments = {
      ...state.appointments,
      [appointmentId]: editedAppointment,
    };

    return axios
      .put(`/api/appointments/${appointmentId}`, editedAppointments[appointmentId])
      .then(setState({ ...state, appointments: editedAppointments }));
  }

  const setDay = (day) => setState((prev) => ({ ...prev, day }));

  useEffect(() => {
    const daysAPI = `http://localhost:8001/api/days`;
    const appointmentAPI = `http://localhost:8001/api/appointments`;
    const interviewerAPI = `http://localhost:8001/api/interviewers`;
    Promise.all([
      axios.get(daysAPI),
      axios.get(appointmentAPI),
      axios.get(interviewerAPI),
    ]).then((all) => {
      const [days, appointments, interviewers] = all;
      setState((prev) => ({
        ...prev,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data,
      }));
    });
  }, []);

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);
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
        editInterview={editInterview}
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
            editInterview={editInterview}
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
          editInterview={editInterview}
        />
      </section>
    </main>
  );
}
