/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from "@storybook/vue";
import { action } from "@storybook/addon-actions";

import Avatar from "../components/avatar.vue";

storiesOf("Avatar", module).add("Normal", () => ({
  components: { Avatar },
  template: '<Avatar @click="action" />',
  methods: { action: action("clicked") }
}));
