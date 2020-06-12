/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * @fileoverview
 * The functions exported by this module make it easier (and safer) to override
 * foreign object methods (in a modular way) and respond to or modify their
 * invocation. The primary feature is the ability to override a method without
 * worrying if it's already been overridden somewhere else in the codebase. It
 * also allows for safe restoring of an overridden method by only fully
 * restoring a method once all overrides have been removed.
 */


const instances = [];


/**
 * A class that wraps a foreign object method and emit events before and
 * after the original method is called.
 */
class MethodChain {
  /**
   * Adds the passed override method to the list of method chain overrides.
   * @param {!Object} context The object containing the method to chain.
   * @param {string} methodName The name of the method on the object.
   * @param {!Function} methodOverride The override method to add.
   */
  static add(context, methodName, methodOverride) {
    getOrCreateMethodChain(context, methodName).add(methodOverride);
  }

  /**
   * Removes a method chain added via `add()`. If the override is the
   * only override added, the original method is restored.
   * @param {!Object} context The object containing the method to unchain.
   * @param {string} methodName The name of the method on the object.
   * @param {!Function} methodOverride The override method to remove.
   */
  static remove(context, methodName, methodOverride) {
    getOrCreateMethodChain(context, methodName).remove(methodOverride);
  }

  /**
   * Wraps a foreign object method and overrides it. Also stores a reference
   * to the original method so it can be restored later.
   * @param {!Object} context The object containing the method.
   * @param {string} methodName The name of the method on the object.
   */
  constructor(context, methodName) {
    this.context = context;
    this.methodName = methodName;
    this.isTask = /Task$/.test(methodName);

    this.originalMethodReference = this.isTask ?
        context.get(methodName) : context[methodName];

    this.methodChain = [];
    this.boundMethodChain = [];

    // Wraps the original method.
    this.wrappedMethod = (...args) => {
      const lastBoundMethod =
          this.boundMethodChain[this.boundMethodChain.length - 1];

      return lastBoundMethod(...args);
    };

    // Override original method with the wrapped one.
    if (this.isTask) {
      context.set(methodName, this.wrappedMethod);
    } else {
      context[methodName] = this.wrappedMethod;
    }
  }

  /**
   * Adds a method to the method chain.
   * @param {!Function} overrideMethod The override method to add.
   */
  add(overrideMethod) {
    this.methodChain.push(overrideMethod);
    this.rebindMethodChain();
  }

  /**
   * Removes a method from the method chain and restores the prior order.
   * @param {!Function} overrideMethod The override method to remove.
   */
  remove(overrideMethod) {
    const index = this.methodChain.indexOf(overrideMethod);
    if (index > -1) {
      this.methodChain.splice(index, 1);
      if (this.methodChain.length > 0) {
        this.rebindMethodChain();
      } else {
        this.destroy();
      }
    }
  }

  /**
   * Loops through the method chain array and recreates the bound method
   * chain array. This is necessary any time a method is added or removed
   * to ensure proper original method context and order.
   */
  rebindMethodChain() {
    this.boundMethodChain = [];
    for (let method, i = 0; method = this.methodChain[i]; i++) {
      const previousMethod = this.boundMethodChain[i - 1] ||
          this.originalMethodReference.bind(this.context);
      this.boundMethodChain.push(method(previousMethod));
    }
  }

  /**
   * Calls super and destroys the instance if no registered handlers remain.
   */
  destroy() {
    const index = instances.indexOf(this);
    if (index > -1) {
      instances.splice(index, 1);
      if (this.isTask) {
        this.context.set(this.methodName, this.originalMethodReference);
      } else {
        this.context[this.methodName] = this.originalMethodReference;
      }
    }
  }
}


/**
 * Gets a MethodChain instance for the passed object and method. If the method
 * has already been wrapped via an existing MethodChain instance, that
 * instance is returned.
 * @param {!Object} context The object containing the method.
 * @param {string} methodName The name of the method on the object.
 * @return {!MethodChain}
 */
function getOrCreateMethodChain(context, methodName) {
  let methodChain = instances
      .filter((h) => h.context == context && h.methodName == methodName)[0];

  if (!methodChain) {
    methodChain = new MethodChain(context, methodName);
    instances.push(methodChain);
  }
  return methodChain;
}

/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


const VERSION = '2.4.1';
const DEV_ID = 'i5iSjo';

const VERSION_PARAM = '_av';
const USAGE_PARAM = '_au';

const a = document.createElement('a');

/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * Accepts default and user override fields and an optional tracker, hit
 * filter, and target element and returns a single object that can be used in
 * `ga('send', ...)` commands.
 * @param {FieldsObj} defaultFields The default fields to return.
 * @param {FieldsObj} userFields Fields set by the user to override the
 *     defaults.
 * @param {Tracker=} tracker The tracker object to apply the hit filter to.
 * @param {Function=} hitFilter A filter function that gets
 *     called with the tracker model right before the `buildHitTask`. It can
 *     be used to modify the model for the current hit only.
 * @param {Element=} target If the hit originated from an interaction
 *     with a DOM element, hitFilter is invoked with that element as the
 *     second argument.
 * @param {(Event|TwttrEvent)=} event If the hit originated via a DOM event,
 *     hitFilter is invoked with that event as the third argument.
 * @return {!FieldsObj} The final fields object.
 */
function createFieldsObj(
    defaultFields, userFields, tracker = undefined,
    hitFilter = undefined, target = undefined, event = undefined) {
  if (typeof hitFilter == 'function') {
    const originalBuildHitTask = tracker.get('buildHitTask');
    return {
      buildHitTask: (/** @type {!Model} */ model) => {
        model.set(defaultFields, null, true);
        model.set(userFields, null, true);
        hitFilter(model, target, event);
        originalBuildHitTask(model);
      },
    };
  } else {
    return assign({}, defaultFields, userFields);
  }
}


/**
 * A small shim of Object.assign that aims for brevity over spec-compliant
 * handling all the edge cases.
 * @param {!Object} target The target object to assign to.
 * @param {...?Object} sources Additional objects who properties should be
 *     assigned to target. Non-objects are converted to objects.
 * @return {!Object} The modified target object.
 */
const assign = Object.assign || function(target, ...sources) {
  for (let i = 0, len = sources.length; i < len; i++) {
    const source = Object(sources[i]);
    for (let key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};


/**
 * Capitalizes the first letter of a string.
 * @param {string} str The input string.
 * @return {string} The capitalized string
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
/*eslint-enable */

/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * Provides a plugin for use with analytics.js, accounting for the possibility
 * that the global command queue has been renamed or not yet defined.
 * @param {string} pluginName The plugin name identifier.
 * @param {Function} pluginConstructor The plugin constructor function.
 */
function provide(pluginName, pluginConstructor) {
  const gaAlias = window.GoogleAnalyticsObject || 'ga';
  window[gaAlias] = window[gaAlias] || function(...args) {
    (window[gaAlias].q = window[gaAlias].q || []).push(args);
  };

  // Adds the autotrack dev ID if not already included.
  window.gaDevIds = window.gaDevIds || [];
  if (window.gaDevIds.indexOf(DEV_ID) < 0) {
    window.gaDevIds.push(DEV_ID);
  }

  // Formally provides the plugin for use with analytics.js.
  window[gaAlias]('provide', pluginName, pluginConstructor);

  // Registers the plugin on the global gaplugins object.
  window.gaplugins = window.gaplugins || {};
  window.gaplugins[capitalize(pluginName)] = pluginConstructor;
}

/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


const plugins = {
  CLEAN_URL_TRACKER: 1,
  EVENT_TRACKER: 2,
  IMPRESSION_TRACKER: 3,
  MEDIA_QUERY_TRACKER: 4,
  OUTBOUND_FORM_TRACKER: 5,
  OUTBOUND_LINK_TRACKER: 6,
  PAGE_VISIBILITY_TRACKER: 7,
  SOCIAL_WIDGET_TRACKER: 8,
  URL_CHANGE_TRACKER: 9,
  MAX_SCROLL_TRACKER: 10,
};


const PLUGIN_COUNT = Object.keys(plugins).length;


/**
 * Tracks the usage of the passed plugin by encoding a value into a usage
 * string sent with all hits for the passed tracker.
 * @param {!Tracker} tracker The analytics.js tracker object.
 * @param {number} plugin The plugin enum.
 */
function trackUsage(tracker, plugin) {
  trackVersion(tracker);
  trackPlugin(tracker, plugin);
}


/**
 * Converts a hexadecimal string to a binary string.
 * @param {string} hex A hexadecimal numeric string.
 * @return {string} a binary numeric string.
 */
function convertHexToBin(hex) {
  return parseInt(hex || '0', 16).toString(2);
}


/**
 * Converts a binary string to a hexadecimal string.
 * @param {string} bin A binary numeric string.
 * @return {string} a hexadecimal numeric string.
 */
function convertBinToHex(bin) {
  return parseInt(bin || '0', 2).toString(16);
}


/**
 * Adds leading zeros to a string if it's less than a minimum length.
 * @param {string} str A string to pad.
 * @param {number} len The minimum length of the string
 * @return {string} The padded string.
 */
function padZeros(str, len) {
  if (str.length < len) {
    let toAdd = len - str.length;
    while (toAdd) {
      str = '0' + str;
      toAdd--;
    }
  }
  return str;
}


/**
 * Accepts a binary numeric string and flips the digit from 0 to 1 at the
 * specified index.
 * @param {string} str The binary numeric string.
 * @param {number} index The index to flip the bit.
 * @return {string} The new binary string with the bit flipped on
 */
function flipBitOn(str, index) {
  return str.substr(0, index) + 1 + str.substr(index + 1);
}


/**
 * Accepts a tracker and a plugin index and flips the bit at the specified
 * index on the tracker's usage parameter.
 * @param {Object} tracker An analytics.js tracker.
 * @param {number} pluginIndex The index of the plugin in the global list.
 */
function trackPlugin(tracker, pluginIndex) {
  const usageHex = tracker.get('&' + USAGE_PARAM);
  let usageBin = padZeros(convertHexToBin(usageHex), PLUGIN_COUNT);

  // Flip the bit of the plugin being tracked.
  usageBin = flipBitOn(usageBin, PLUGIN_COUNT - pluginIndex);

  // Stores the modified usage string back on the tracker.
  tracker.set('&' + USAGE_PARAM, convertBinToHex(usageBin));
}


/**
 * Accepts a tracker and adds the current version to the version param.
 * @param {Object} tracker An analytics.js tracker.
 */
function trackVersion(tracker) {
  tracker.set('&' + VERSION_PARAM, VERSION);
}

/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * Class for the `urlChangeTracker` analytics.js plugin.
 * @implements {UrlChangeTrackerPublicInterface}
 */
class UrlChangeTracker {
  /**
   * Adds handler for the history API methods
   * @param {!Tracker} tracker Passed internally by analytics.js
   * @param {?Object} opts Passed by the require command.
   */
  constructor(tracker, opts) {
    trackUsage(tracker, plugins.URL_CHANGE_TRACKER);

    // Feature detects to prevent errors in unsupporting browsers.
    if (!history.pushState || !window.addEventListener) return;

    /** @type {UrlChangeTrackerOpts} */
    const defaultOpts = {
      shouldTrackUrlChange: this.shouldTrackUrlChange,
      trackReplaceState: false,
      fieldsObj: {},
      hitFilter: null,
    };

    this.opts = /** @type {UrlChangeTrackerOpts} */ (assign(defaultOpts, opts));

    this.tracker = tracker;

    // Sets the initial page field.
    // Don't set this on the tracker yet so campaign data can be retreived
    // from the location field.
    this.path = getPath();

    // Binds methods.
    this.pushStateOverride = this.pushStateOverride.bind(this);
    this.replaceStateOverride = this.replaceStateOverride.bind(this);
    this.handlePopState = this.handlePopState.bind(this);

    // Watches for history changes.
    MethodChain.add(history, 'pushState', this.pushStateOverride);
    MethodChain.add(history, 'replaceState', this.replaceStateOverride);
    window.addEventListener('popstate', this.handlePopState);
  }

  /**
   * Handles invocations of the native `history.pushState` and calls
   * `handleUrlChange()` indicating that the history updated.
   * @param {!Function} originalMethod A reference to the overridden method.
   * @return {!Function}
   */
  pushStateOverride(originalMethod) {
    return (...args) => {
      originalMethod(...args);
      this.handleUrlChange(true);
    };
  }

  /**
   * Handles invocations of the native `history.replaceState` and calls
   * `handleUrlChange()` indicating that history was replaced.
   * @param {!Function} originalMethod A reference to the overridden method.
   * @return {!Function}
   */
  replaceStateOverride(originalMethod) {
    return (...args) => {
      originalMethod(...args);
      this.handleUrlChange(false);
    };
  }

  /**
   * Handles responding to the popstate event and calls
   * `handleUrlChange()` indicating that history was updated.
   */
  handlePopState() {
    this.handleUrlChange(true);
  }

  /**
   * Updates the page and title fields on the tracker and sends a pageview
   * if a new history entry was created.
   * @param {boolean} historyDidUpdate True if the history was changed via
   *     `pushState()` or the `popstate` event. False if the history was just
   *     modified via `replaceState()`.
   */
  handleUrlChange(historyDidUpdate) {
    // Calls the update logic asychronously to help ensure that app logic
    // responding to the URL change happens prior to this.
    setTimeout(() => {
      const oldPath = this.path;
      const newPath = getPath();

      if (oldPath != newPath &&
          this.opts.shouldTrackUrlChange.call(this, newPath, oldPath)) {
        this.path = newPath;
        this.tracker.set({
          page: newPath,
          title: document.title,
        });

        if (historyDidUpdate || this.opts.trackReplaceState) {
          /** @type {FieldsObj} */
          const defaultFields = {transport: 'beacon'};
          this.tracker.send('pageview', createFieldsObj(defaultFields,
              this.opts.fieldsObj, this.tracker, this.opts.hitFilter));
        }
      }
    }, 0);
  }

  /**
   * Determines whether or not the tracker should send a hit with the new page
   * data. This default implementation can be overrided in the config options.
   * @param {string} newPath The path after the URL change.
   * @param {string} oldPath The path prior to the URL change.
   * @return {boolean} Whether or not the URL change should be tracked.
   */
  shouldTrackUrlChange(newPath, oldPath) {
    return !!(newPath && oldPath);
  }

  /**
   * Removes all event listeners and restores overridden methods.
   */
  remove() {
    MethodChain.remove(history, 'pushState', this.pushStateOverride);
    MethodChain.remove(history, 'replaceState', this.replaceStateOverride);
    window.removeEventListener('popstate', this.handlePopState);
  }
}


provide('urlChangeTracker', UrlChangeTracker);


/**
 * @return {string} The path value of the current URL.
 */
function getPath() {
  return location.pathname + location.search;
}
