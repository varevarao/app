/* eslint-disable react/react-in-jsx-scope, react/no-this-in-sfc */

import { storiesOf } from "@storybook/vue";
import { withContexts } from "@storybook/addon-contexts/vue";
import Centered from "@storybook/addon-centered/vue";

import Card from "../../src/components/card.vue";

const topLevelContexts = [
  {
    icon: "sidebaralt",
    title: "CSS Themes",
    components: ["div"],
    params: [
      {
        name: "Desert",
        props: {
          style: { color: "brown", background: "#F4A261", height: "100vh", padding: "10px" }
        }
      },
      {
        name: "Ocean",
        props: {
          style: { color: "white", background: "#173F5F", height: "100vh", padding: "10px" }
        },
        default: true
      }
    ]
  }
];

const storyLevelContexts = [
  {
    title: "CSS Themes",
    params: [
      {
        name: "Forest",
        props: {
          style: { color: "teal", background: "#00b894", height: "100vh", padding: "10px" }
        }
      }
    ]
  }
];

const stories = storiesOf("Test|Card", module)
  .addDecorator(Centered)
  .add("Welcome", () => ({
    render: h =>
      h(Card, {
        props: {
          title: "Test",
          subtitle: "subtitle",
          href: "https://directus.io",
          icon: "info_outline"
        }
      })
  }))
  .addDecorator(withContexts(topLevelContexts));

stories.add(
  "Simple CSS Theming",
  () => ({
    template:
      "<span>I'm a children of the injected 'div' (where provides a theming context).</span>"
  }),
  {
    contexts: storyLevelContexts
  }
);
/* eslint-enable react/react-in-jsx-scope */
