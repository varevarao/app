/* eslint-disable react/react-in-jsx-scope, react/no-this-in-sfc */

import { storiesOf } from "@storybook/vue";
import Centered from "@storybook/addon-centered/vue";

import CalendarDisplay from "../../../src/interfaces/calendar/display.vue";
import CalendarInput from "../../../src/interfaces/calendar/input.vue";

const stories = storiesOf("Interfaces|Calendar", module).addDecorator(Centered);

const interfaceProps = {
  id: "",
  name: "",
  type: ""
};

stories.add(
  "Display",
  () => ({
    render: h =>
      h(CalendarDisplay, {
        props: {
          ...interfaceProps,
          date: "01-01-2019",
          dateFormat: "Y-m-d"
        }
      })
  }),
  { notes: "This is a Calendar Note yooo!!!" }
);

stories.add(
  "Input",
  () => ({
    render: h =>
      h(CalendarInput, {
        props: interfaceProps
      })
  }),
  { notes: "This is a Calendar Note yooo!!!" }
);
/* eslint-enable react/react-in-jsx-scope */
