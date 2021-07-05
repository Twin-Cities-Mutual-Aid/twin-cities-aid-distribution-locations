// Might not need this hook? Did a bunch of random stuff with this before realizing I think it can all be handled in the context Didn't clean anything up here
import { useReducer } from "react";

function init(filteredLocations) {
  return filteredLocations
}

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

  if (action.type === "reload") {
    action.payload.forEach((location, index) => {
      state[index] = location
    })
    return state
    // return action.payload
    // return init(action.payload);
  }
  const { index, location } = action;
  const newLocation = { ...state[index], ...location };
  state[index] = newLocation;
  return state;
}

const useLocation = (initialLocations) => {
  // const updatedLocations = () => (filteredLocations)

  // const [locations, dispatch] = useReducer(reducer, initialLocations, updatedLocations);
  // const [locations, dispatch] = useReducer(reducer, initialLocations, init);
  const [locations, dispatch] = useReducer(reducer, initialLocations);
  const closePopups = (index) => dispatch({ type: "close", index });
  const filterResults = (filteredLocations) => dispatch({ type: "reload", payload: filteredLocations });
  return { closePopups, locations, dispatchLocation: dispatch, filterResults };
};

export default useLocation;
