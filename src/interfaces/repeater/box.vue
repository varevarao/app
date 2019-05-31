<template>
  <div class="box" :class="{ closed: !open }">
    <div class="header" @click="$emit('open')">
      <div class="start">
        <v-icon name="drag_handle"></v-icon>
        <v-ext-display
          v-for="(value, key) in headers"
          :key="key"
          :interface-type="value.interface"
          :options="fields[key].options"
          type="null"
          :name="value.field"
          :value="data[key]"
        ></v-ext-display>
      </div>
      <div class="end">
        <v-icon :name="open ? 'unfold_less' : 'unfold_more'"></v-icon>
        <v-icon name="delete" @click.native.stop="$emit('delete')"></v-icon>
      </div>
    </div>
    <div class="container">
      <v-form
        :fields="fields"
        :values="data"
        @stage-value="$emit('stage-value', { id, data: $event })"
      ></v-form>
    </div>
  </div>
</template>

<script>
export default {
  props: ["id", "headers", "fields", "data", "open"],
  computed: {},
  methods: {}
};
</script>

<style lang="scss" scoped>
i {
  cursor: pointer;
}

.box {
  background-color: var(--lightest-gray);
  border-radius: var(--border-radius);
  border: 2px solid var(--lighter-gray);
  overflow: hidden;
  margin: 10px 0;

  &.closed {
    height: calc(var(--input-height) + 4px);
  }

  .header {
    position: relative;
    padding: 10px;
    height: var(--input-height);
    display: flex;
    justify-content: space-between;
    align-items: center;

    :after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 10px;
      width: calc(100% - 20px);
      height: 2px;
      background-color: var(--lighter-gray);
      opacity: 0.1;
    }

    .start {
      display: flex;
      align-items: center;

      .v-ext-display {
        color: var(--darker-gray);
        font-size: 14px;
        margin: 10px;
      }
    }
  }

  .container {
    padding: 10px;

    .form {
      grid-template-columns:
        [start] minmax(0, var(--column-width)) [half] minmax(0, var(--column-width))
        [full];
    }
  }
}
</style>
