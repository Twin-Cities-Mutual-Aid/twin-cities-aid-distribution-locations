// TODO: this isn't being imported in pages/index.jsx yet! Figure out how to make this useful and then do that
const FilterPane = () => {
  return (
    <div className="filter-pane white-and-blue">
      <div className="legend" id="key"></div>
      <button
        data-translation-id="show_list_button"
        id="locations-toggle-button"
        className="location-list-toggle toggle-button"
        aria-label="Show list of locations"
      >
        Show list of locations
      </button>
      <button
        data-translation-id="help_info"
        id="help-info-toggle-button"
        className="toggle-button"
        aria-label="Toggle help info section"
      >
        Help/info
      </button>
    </div>
  );
};

export default FilterPane;