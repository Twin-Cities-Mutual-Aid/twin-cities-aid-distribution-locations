import { useReducer } from "react";

function reducer(state, action) {
  if (action.type === "close") {
    state.forEach((location, i) => {
      /**
       * If an index is passed in, we close every popup *except*
       * for the one at the specified index.
       * If there isn't an index passed in, simply close every popup.
       */
      if (
        location.marker.getPopup().isOpen() &&
        (!action.index || action.index !== i)
      )
        location.marker.togglePopup();
      /** If an index is passed in and its popup is closed, open it! */
      if (action.index === i && !location.marker.getPopup().isOpen())
        location.marker.togglePopup();
    });

    return state;
  }
  const { index, location } = action;
  const newLocation = { ...state[index], ...location };
  state[index] = newLocation;
  return state;
}

const useLocation = (initialLocations) => {
  const [locations, dispatch] = useReducer(reducer, initialLocations);
  const closePopups = (index) => dispatch({ type: "close", index });
  return { closePopups, locations, dispatchLocation: dispatch };
};

export default useLocation;
