/**
 * Filter adds a filter control to the side panel location list
 */
class Filter {
  
  constructor(el, options) {
    Object.assign(this, options)
    this.$filters = []

    this.$el = el
    this.$controls = document.getElementById('filter-controls')
    this.renderControls(this.$controls)
    this.list = new List(this.$el.id, {
      valueNames: this.sortOptions.map(o => o.name)
    })
    /** Hide "open for both" filter */
    this.$filters[2].parentElement.style.display = 'none'
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
    }
    if (!filterValues[0] && !filterValues[1]) {
      filterValues[2] = false
    }

    this.list.filter(i => {
        const index = _.findIndex(this.statusOptions, o => { 
          return o.id === i.values().status;
        });
        return filterValues[index]
      })
    this.list.sort(sortSettings.name, sortSettings.sort)
  }

  renderControls() {
    
    const options = this.sortOptions.map(o => {
      return `<option value="${o.name}" ${o.selected && 'selected'}>${o.label}</option>`
    }).join('')


    const filters = this.statusOptions.map(s => {
      return `<li class='filter-item'><input class="filter" type="checkbox" id="filter-${s.name}" value="${s.name}" checked><label for="filter-${s.name}">${s.label}</label></li>`
    }).join('')

    this.$controls.innerHTML = `
      <div class="select-container">  
        <label for="sort-by">Sort by: </label>
        <select name="sort-by" id="sort-by">
          ${options}
        </select>
      </div>
      <ul class="filters">
        ${filters}
      </ul>
    `

    this.$sort = document.getElementById('sort-by')
    // // convert node list to array so we can use forEach
    this.$filters = Array.prototype.slice.call(this.$controls.querySelectorAll('input[type="checkbox"]'))
    this.$sort.addEventListener('change', this.update.bind(this))
    this.$filters.forEach($e => $e.addEventListener('change', this.update.bind(this)))
  }
}