import { configure, addParameters, addDecorator } from '@storybook/vue';
import Vue from 'vue';
import Vuex from 'vuex';
import { withA11y } from '@storybook/addon-a11y';

// Registers the global Vue components, so they can be used in stories
import '../src/globals';

import '../src/design/main.scss'

Vue.use(Vuex);

addDecorator(withA11y);

addParameters({
  options: {
    hierarchyRootSeparator: /\|/,
  },
  backgrounds: [
    { name: 'light', value: '#fff', default: true },
    { name: 'gray', value: '#eceff1' },
    { name: 'dark', value: '#263238' },
  ],
});
// automatically import all files ending in *.stories.js

const req = require.context('../src', true, /.stories.js$/)

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
