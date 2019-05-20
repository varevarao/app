<template>
  <div class="status-mapping">
    <div class="boxes">
      <draggable v-model="boxes">
        <Box
          v-for="(value, index) in boxes"
          :key="index"
          :id="index"
          :headers="headers"
          :fields="formFields"
          :data="value"
          :open="index == open"
          @stage-value="stageValue"
          @open="openBox(index)"
          @delete="deleteBox(index)"
        ></Box>
      </draggable>
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
        return this.$lodash.values(this.value) || [];
      },
      set(value) {
        var obj = {};
        for (var i = 0; i < value.length; i++) {
          obj[i] = value[i];
        }
        this.$emit("input", obj);
      }
    }
  },
  methods: {
    addBox() {
      var box = {};
      this.$lodash.forOwn(this.options.fields, (value, key) => {
        box[key] = null;
      });

      this.open = this.boxes.length;
      this.boxes.push(box);
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
