import _ from 'lodash'

/**
 * Filter adds a filter control to the side panel location list
 */
class Filter {

  constructor(el, options) {
    this.onAfterUpdate = () => {}
    Object.assign(this, options)
    this.$filters = []

    this.$el = el
    this.$controls = document.getElementById('filter-controls')
    this.renderControls(this.$controls)
    this.list = new List(this.$el.id, {
      valueNames: this.sortOptions.map(o => o.name)
    })
    /** Default filter-both checkbox to be disabled. only
     * enabled if "receiving" and "distributing" checkboxes
     * are BOTH unchecked.
     */
    document.getElementById("filter-both").disabled = true

    // Uncheck unknown status locations to make a clearer call to action for new users on the site.
    document.getElementById("filter-unknown").checked = false
    this.update()
  }

  update() {
    const sortSettings = _.find(this.sortOptions, o => (o.name === this.$sort.value))
    let filterValues = this.$filters.map(f => f.checked)
    /** if "open for receiving donations" (item 0) or "open for distributing donations" (item 1)
     * is checked, then items categorized as "open for both" (item 2) information should be
     * automatically displayed as well.
     */
    if (filterValues[0] === true || filterValues[1] === true) {
      filterValues[2] = true
      document.getElementById("filter-both").checked = true
      document.getElementById("filter-both").disabled = true
    }
    else {
      document.getElementById("filter-both").disabled = false
    }

    this.toggleMapPoints(filterValues);
    this.list.filter(i => {
        const index = _.findIndex(this.statusOptions, o => {
          return o.id === i.values().status;
        });
        return filterValues[index]
      })
    this.list.sort(sortSettings.name, sortSettings.sort)

    this.onAfterUpdate()
  }

  toggleMapPoints(filterValues) {
    const $map = document.getElementById("map");
    this.statusOptions.map((status, i) => {
      if (filterValues[i]) {
        $map.classList.remove("hide-" + status.name);
      } else {
        $map.classList.add("hide-" + status.name);
      }
    });
  }

  renderControls() {

    const options = this.sortOptions.map(o => {
      return `<option data-translation-id="sort_by_${_.snakeCase(o.name)}" value="${o.name}" ${o.selected && 'selected'}>${o.label}</option>`
    }).join('')


    const filters = this.statusOptions.map(s => {
      return `<li class='filter-item'><input class="filter" type="checkbox" id="filter-${s.name}" value="${s.name}" checked><span class="legend--item--swatch" style="background-color: ${s.accessibleColor}"></span><label data-translation-id="filter_by_${_.snakeCase(s.name)}" for="filter-${s.name}">${s.label}</label><label> (${s.count})</label></li>`
    }).join('')

    this.$controls.innerHTML = `
      <div class="select-container">  
        <label for="sort-by"><span data-translation-id="sort_by">Sort by</span>: </label>
        <select name="sort-by" id="sort-by">
          ${options}
        </select>
      </div>
    `

    const $key = document.getElementById("key");
    $key.innerHTML = `<ul class="filters">${filters}</ul>`;

    this.$sort = document.getElementById('sort-by')
    // // convert node list to array so we can use forEach
    this.$filters = Array.prototype.slice.call($key.querySelectorAll('input[type="checkbox"]'))
    this.$sort.addEventListener('change', this.update.bind(this))
    this.$filters.forEach($e => $e.addEventListener('change', this.update.bind(this)))
  }
}

export default Filter
