import { configure, addParameters, addDecorator } from '@storybook/vue';
import Vue from 'vue';
import Vuex from 'vuex';
import { withA11y } from '@storybook/addon-a11y';

// Registers vue components, so they can it is no problem to write stories with components who inherit others
import '../src/globals';

import '../src/design/main.scss'
import './storybook.scss'

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
