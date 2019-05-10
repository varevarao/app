/* eslint-disable react/react-in-jsx-scope, react/no-this-in-sfc */

import { storiesOf } from "@storybook/vue";
import Centered from "@storybook/addon-centered/vue";

import Card from "../../src/components/card.vue";

const stories = storiesOf("UI|Card", module).addDecorator(Centered);

stories.add("Card", () => ({
  render: h =>
    h(Card, {
      props: {
        title: "Test",
        subtitle: "subtitle",
        href: "https://directus.io",
        icon: "info_outline",
        name: ""
      }
    })
}));

stories.add("Card with Color", () => ({
  render: h =>
    h(Card, {
      props: {
        title: "Purple Card",
        subtitle: "subtitle",
        href: "https://directus.io",
        icon: "info_outline",
        name: "test",
        color: "purple"
      }
    })
}));
/* eslint-enable react/react-in-jsx-scope */
