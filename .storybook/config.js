import { configure, addParameters, addDecorator } from '@storybook/vue';
import Vue from 'vue';
import Vuex from 'vuex';
import { withA11y } from '@storybook/addon-a11y';

// import '../src/design/main.scss'

Vue.use(Vuex);
addDecorator(withA11y);

addParameters({
  options: {
    hierarchyRootSeparator: /\|/,
  },
});
// automatically import all files ending in *.stories.js

const req = require.context('../stories', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
