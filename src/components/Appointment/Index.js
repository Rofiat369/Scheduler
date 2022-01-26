import React, { useState } from "react";
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointments(props) {
const [editing, setEditing] = useState(false)

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  //function to save the booked interview in the appointments objects
  const save = (student, interviewer) => {
    const interview = { student, interviewer };
    transition(SAVING, true);
    props
      .bookInterview(props.id, interview, editing)
      .then(() => transition(SHOW))
      .catch((error) => transition(ERROR_SAVE, true));
  };

  //confirm deletion before deleting
  const confirm = () => {
    transition(CONFIRM);
  };

  //function to delete the booked appointment
  const removeAppointment = () => {
    transition(DELETING, true);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch((error) => {
        console.log(error)
        transition(ERROR_DELETE, true)
      });
  };

  //interview edit
  const edit = () => {
    setEditing(true)
    transition(EDIT)};

    //create interview
    const create = () => {
      setEditing(false)
      transition(CREATE)};

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === CREATE && (
        <Form interviewers={props.interviewers} onCancel={back} onSave={save} />
      )}
      {mode === EMPTY && <Empty onAdd={create} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={confirm}
          onEdit={edit}
        />
      )}
      {mode === SAVING && <Status message="Saving" />}
      {mode === DELETING && <Status message={"Deleting"} />}
      {mode === CONFIRM && (
        <Confirm
          onCancel={back}
          onConfirm={() => removeAppointment(props.id)}
        />
      )}
      {mode === EDIT && (
        <Form
          student={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error message="Could not save appointment" onClose={back} />
      )}
      {mode === ERROR_DELETE && (
        <Error message="Could not delete appointment" onClose={back} />
      )}
    </article>
  );
}
