import React from "react";
import "components/Appointment/styles.scss";
import Header from "./header";
import Show from "./show";
import Empty from "./empty";


export default function Appointments(props){
  const showOrEmpty = props.interview? <Show /> : <Empty />;

return(
<article className="appointment">
<Header time={props.time}/>
{showOrEmpty}

</article>
);
}