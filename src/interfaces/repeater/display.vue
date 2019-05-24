<template>
  <v-popover trigger="hover" v-if="valueFields && valueFields.length > 0">
    <div>{{ itemCount }}</div>

    <template slot="popover">
      <ul class="list">
        <li v-for="(val, i) in value" :key="i">{{ val[valueFields[0]] }}</li>
      </ul>
    </template>
  </v-popover>

  <div v-else class="item-count">{{ itemCount }}</div>
</template>

<script>
import mixin from "@directus/extension-toolkit/mixins/interface";

export default {
  mixins: [mixin],
  computed: {
    valueFields() {
      return this.$lodash
        .chain(this.options.fields)
        .pickBy(value => {
          return value.hasOwnProperty("preview") && value.preview;
        })
        .keys()
        .value();
    },
    itemCount() {
      return this.$lodash.keys(this.value).length + " Items";
    }
  }
};
</script>

<style lang="scss" scoped>
.list {
  max-height: 200px;
  overflow-y: auto;

  list-style: none;
  padding: 0;

  li {
    color: var(--dark-gray);
    padding: 8px 0;

    &:not(:last-of-type) {
      border-bottom: 1px solid var(--lightest-gray);
    }
  }
}
</style>
