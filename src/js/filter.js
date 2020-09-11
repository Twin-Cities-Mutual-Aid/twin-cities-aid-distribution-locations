import _ from 'lodash'
import { setQueryParam } from './url-helpers';

/**
 * Filter adds a filter control to the side panel location list
 */
class Filter {

  constructor(el, options) {
    this.onAfterUpdate = () => {}
    Object.assign(this, options)
    this.$filters = []

    this.$el = el
    this.$searchControl = document.getElementById("search-controls")
    this.$controls = document.getElementById("filter-controls")
    this.$legendOverlay = document.getElementById("legend-overlay")
    this.$toggleLegendButton = document.getElementById("toggle-legend-button")
    this.renderControls(this.$controls)
    this.list = new List(this.$el.id, {
      valueNames: [...this.sortOptions.map(o => o.name), ...this.searchOptions.searchOn],
      search: this.searchOptions.search
    })
    /** Default filter-both checkbox to be disabled. only
     * enabled if "receiving" and "distributing" checkboxes
     * are BOTH unchecked.
     */
    document.getElementById("filter-both").disabled = true
    this.update()
    if(this.searchOptions.initialSearch) {
      this.search(this.searchOptions.initialSearch)
    }
  }

  getListResults() {
    const listResults = document.querySelectorAll('.location-list--item')
    this.$listResults.innerText = `${listResults.length}`
  }

  update(event) {
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

    this.toggleMapPointsForFilter(filterValues);
    this.list.filter(i => {
        const index = _.findIndex(this.statusOptions, o => {
          return o.id === i.values().status;
        });
        return filterValues[index]
      })
    this.list.sort(sortSettings.name, sortSettings.sort)

    this.getListResults();
    this.onAfterUpdate()

    // track events for google analytics
    if(event) {
      if(event.target.id === 'sort-by') {
        const options = Array.from(event.target.children);
        const selected = options.find(o => o.value === event.target.value);
        gtag('event', 'select', {
          'event_category': 'Sort Filter',
          'event_label': `${event.target.value}: ${selected.innerText}`
        })
      } else {
        const parent = event.target.parentElement;
        const siblings = Array.from(parent.children);
        const selected = siblings.find(e => e.nodeName === 'LABEL')
        const eventAction = event.target.checked ? 'Check' : 'Uncheck'
        gtag('event', eventAction, {
          'event_category': 'Search Filter',
          'event_label': `${event.target.value}: ${selected.innerText}`
        })
      }
    }
  }

  toggleMapPointsForFilter(filterValues) {
    const $map = document.getElementById("map");
    this.statusOptions.map((status, i) => {
      if (filterValues[i]) {
        $map.classList.remove("hide-" + status.name);
      } else {
        $map.classList.add("hide-" + status.name);
      }
    });
  }

  toggleMapPointsForSearch(searchTerm, searchResults) {
    if(!searchTerm) {
      this.locations.forEach(location => {
        const $location = location.marker.getElement()
        $location.classList.remove('hide-search-result')
      })
    } else {
      this.locations.forEach(location => {
        const $location = location.marker.getElement()
        if (searchResults.includes(location.address)) {
          $location.classList.remove('hide-search-result')
        } else {
          $location.classList.add('hide-search-result');
        }
      })
    }
  }

  search(searchTerm) {
    this.list.search(searchTerm, this.searchOptions.searchOn)
    const searchResults = this.list.items.filter(item => item.found).map(item => item.values().address);
    if(!searchTerm) {
      this.$clearSearchBtn.classList.add('hide-clear-search')
      this.$searchInputGroup.classList.add('search-full-width')
    } else {
      this.$clearSearchBtn.classList.remove('hide-clear-search')
      this.$searchInputGroup.classList.remove('search-full-width')
    }

    this.toggleMapPointsForSearch(searchTerm, searchResults)
    this.$locationList.classList.remove('loading-indicator')
    this.onAfterUpdate()
    this.getListResults();
    setQueryParam('search', searchTerm);

    gtag('event', 'search_trigger', {
      'event_category': 'search',
      'event_label': searchTerm
    })
  }

  renderControls() {
    const options = this.sortOptions.map(o => {
      return `<option data-translation-id="sort_by_${_.snakeCase(o.name)}" value="${o.name}" ${o.selected && 'selected'}>${o.label}</option>`
    }).join('')


    const filters = this.statusOptions.map(s => {
      return `<li class='filter-item'><input class="filter" type="checkbox" id="filter-${s.name}" value="${s.name}" checked><span class="legend--item--swatch" style="background-color: ${s.accessibleColor}"></span><label data-translation-id="filter_by_${_.snakeCase(s.name)}" for="filter-${s.name}">${s.label}</label><label> (${s.count})</label></li>`
    }).join('')

    this.$searchControl.innerHTML = `
    <form id="search-form" role="search" class="search-container" action="javascript:void(0);">
        <div class="search-input-group search-full-width">
          <label for="search">
            <span class="sr-only">Type here to search sites or needs</span>
          </label>
          <img class="search-icon" src='images/icon_search.svg' alt='search icon'/>
          
          <input type="text" class="search-input" value="${this.searchOptions.initialSearch.replace(/\"/g, '')}" id="search" placeholder="Search sites or needs..." data-translation-id="search"></input>
          <img id="clear-search-btn" class="hide-clear-search" data-translation-id="search_clear" src='images/icon_clear_search.svg' alt='clear search button'/>
        </div>
      </form>
      <div class="list-meta">
      <div class="list-results"><span id="list-results-count">${this.locations.length}</span> <span data-translation-id="list_results">results</span></div>
    </div>
    `

    this.$controls.innerHTML = `
      <div class="select-container">
        <label for="sort-by"><span data-translation-id="sort_by">Sort by</span>: </label>
        <select class="custom-select" name="sort-by" id="sort-by" data-translate-font>
          ${options}
        </select>
      </div>
    `

    const debouncedSearch = _.debounce(this.search.bind(this), 300);

    const $key = document.getElementById("key");
    $key.innerHTML = `<ul class="filters">${filters}</ul>`;

    this.$locationList = document.getElementById('location-list')
    this.$sort = document.getElementById('sort-by')
    this.$search = document.getElementById('search')
    this.$searchForm = document.getElementById('search-form')
    this.$searchInputGroup = document.getElementsByClassName('search-input-group')[0]
    this.$listResults = document.getElementById('list-results-count')
    this.$clearSearchBtn = document.getElementById('clear-search-btn')
    this.$filters = Array.prototype.slice.call($key.querySelectorAll('input[type="checkbox"]'))
    this.$sort.addEventListener('change', this.update.bind(this))
    this.$search.addEventListener('input', event => {
      this.$locationList.classList.add('loading-indicator');
      debouncedSearch.bind(this)(event.currentTarget.value);
    })
    this.$searchForm.addEventListener('keydown', (event) => {
      // disable enter as it clears out search which is not likely a desired action
      if(event.keyCode === 13) event.preventDefault();
    })
    this.$clearSearchBtn.addEventListener('click', event => {
      this.$search.value = '';
      this.$clearSearchBtn.classList.add('hide-clear-search');
      this.$searchInputGroup.classList.add('search-full-width')
      this.search.bind(this)(event.currentTarget.value)
    })
    this.$filters.forEach($e => $e.addEventListener('change', this.update.bind(this)))

    this.statusOptions.forEach(statusOption => {
      this.createLegendOverlayItem(statusOption);
    })

    const $filterDropdown = document.getElementById("filter-dropdown");
    $filterDropdown.addEventListener("click", 
    event => this.toggleFilters());
    // this.$toggleLegendButton.addEventListener("click", 
    //   event => this.toggleFilters());

  }

  createLegendOverlayItem(option) {
    const item = document.createElement('div');
    item.innerHTML = `<button class="legend-overlay-item" style="background-color: ${option.accessibleColor}; color: ${option.textColor}" data-translation-id="${option.name}">${option.name}</button>`
    this.$legendOverlay.append(item);
  }

  toggleFilters() {
    this.$toggleLegendButton.classList.toggle("open");
    const panel = document.getElementById("legend-container");
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
    if (this.$legendOverlay.style.maxWidth) {
      this.$legendOverlay.style.maxWidth = null;
    } else {
      this.$legendOverlay.style.maxWidth = panel.scrollWidth + "px";
    }
  }
  
}

export default Filter
