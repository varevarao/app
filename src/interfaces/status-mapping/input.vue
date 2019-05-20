<template>
  <div class="status-mapping">
    <div class="boxes">
      <Box
        v-for="(value, key) in boxes"
        :key="key"
        :id="key"
        :headers="headers"
        :fields="formFields"
        :data="value"
        :open="key == open"
        @stage-value="stageValue"
        @open="openBox(key)"
        @delete="deleteBox(key)"
      ></Box>
    </div>
    <v-button icon="add" @click="addBox">Add Status</v-button>
  </div>
</template>

<script>
import mixin from "@directus/extension-toolkit/mixins/interface";
import Box from "./box.vue";

export default {
  mixins: [mixin],
  data() {
    return {
      open: null
    };
  },
  components: {
    Box
  },
  computed: {
    headers() {
      return this.$lodash.pickBy(this.options.fields, value => {
        return value.hasOwnProperty("preview") && value.preview;
      });
    },
    formFields() {
      var fields = this.options.fields;
      this.$lodash.forOwn(fields, (value, key) => {
        fields[key].hidden_detail = false;
        if (!fields[key].hasOwnProperty("field")) fields[key].field = key;
      });
      return fields;
    },
    boxes: {
      get() {
        return this.$lodash.cloneDeep(this.value) || {};
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  methods: {
    addBox() {
      var keys = this.$lodash.keys(this.boxes);
      var highest = 0;
      for (var i = 0; i < keys.length; i++) {
        var value = parseInt(keys[i]);
        highest = value > highest ? value : highest;
      }
      highest++;

      var box = {};
      this.$lodash.forOwn(this.options.fields, (value, key) => {
        box[key] = null;
      });

      this.open = highest;
      this.$set(this.boxes, highest, box);
      this.boxes = this.boxes;
    },
    deleteBox(key) {
      delete this.boxes[key];
      this.boxes = this.boxes;
    },
    stageValue({ id, data }) {
      this.$set(this.boxes[id], data.field, data.value);
      this.boxes = this.boxes;
    },
    openBox(id) {
      if (this.open == id) {
        this.open = null;
      } else {
        this.open = id;
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
