import React from "react";
import "components/Appointment/styles.scss";
import Header from "./header";
import Show from "./show";
import Empty from "./empty";
import Form from "./form";
import Status from "./status";
import Confirm from "./confirm";
import useVisualMode from "hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";

export default function Appointments(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  //function to save the booked interview in the appointments objects
  const save = (student, interviewer) => {
    const interview = { student, interviewer };
    transition(SAVING);
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch((error) => console.log(error));
  };

  //confirm deletion before deleting
  const confirm = () => {
    transition(CONFIRM);
  };

  //function to delete the booked appointment
  const removeAppointment = () => {
    transition(DELETING);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch((error) => console.log(error));
  };

  //confirm interview edit
  const edit = () => transition(EDIT);

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === CREATE && (
        <Form interviewers={props.interviewers} onCancel={back} onSave={save} />
      )}
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
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
          interviewer={props.interview.interviewer}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
    </article>
  );
}
