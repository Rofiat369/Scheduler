import React from "react";
import "components/DayListItem.scss";
import classNames from "classnames";
const DayListItem = props => {
  const { spots, selected, name, setDay } = props;
  const formatSpots = spots => {
    if (spots === 1) {
      return `${spots} spot `;
    }
    if (spots > 1) {
      return `${spots} spots `;
    }
    return `no spots `;
  };
  let dayClass = classNames("day-list__item", {
    "day-list__item--selected": selected,
    "day-list__item--full": spots === 0
  });
  return (
    <>
      <li className={dayClass} onClick={() => setDay(name)} selected={selected}>
        <h2 className="text--regular">{name}</h2>
        <h3 className="text--light">{formatSpots(spots)}remaining</h3>
      </li>
    </>
  );
};
export default DayListItem;