<template>
  <div class="box" :class="{ closed: !open }">
    <div class="header" @click="$emit('open')">
      <div class="start">
        <v-icon name="drag_handle"></v-icon>
        <!-- <v-ext-display></v-ext-display> -->
      </div>
      <div class="end">
        <v-icon :name="open ? 'unfold_less' : 'unfold_more'"></v-icon>
        <v-icon name="delete"></v-icon>
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
  props: ["id", "fields", "data", "open"],
  computed: {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.box {
  background-color: var(--lightest-gray);
  border-radius: var(--border-radius);
  border: 2px solid var(--lighter-gray);
  overflow: hidden;
  margin: 10px 0;

  &.closed {
    height: var(--input-height);
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
