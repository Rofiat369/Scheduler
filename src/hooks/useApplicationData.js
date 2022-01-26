import { useState, useEffect } from "react";
import axios from "axios"; //helps us make http requests

const useApplicationData = () => {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState((prev) => ({ ...prev, day }));

  //function to book interview
  function bookInterview(appointmentId, interviewObj, editing) {
    const newAppointment = {
      ...state.appointments[appointmentId],
      interview: interviewObj,
    };

    const newAppointments = {
      ...state.appointments,
      [appointmentId]: newAppointment,
    };

    const newDays = state.days.map((someDay) => {
      if (someDay.name === state.day && !editing) {
        return { ...someDay, spots: someDay.spots - 1 };
      } else {
        return someDay;
      }
    });

    return axios
      .put(`/api/appointments/${appointmentId}`, newAppointments[appointmentId])
      .then(() =>
        setState({ ...state, appointments: newAppointments, days: newDays })
      );
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

    const newDays = state.days.map((someDay) => {
      if (someDay.name === state.day) {
        return { ...someDay, spots: someDay.spots + 1 };
      } else {
        return someDay;
      }
    });

    return axios
      .delete(`/api/appointments/${appointmentId}`)
      .then(() => setState({ ...state, appointments: deletedAppointments, days: newDays }));
    //.catch(error => {throw error});
  }

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

  return { state, setDay, bookInterview, cancelInterview };
};

export default useApplicationData;
