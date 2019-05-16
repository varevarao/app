<template>
  <div class="status-mapping">
    <div class="boxes">
      <Box
        v-for="(value, key) in boxes"
        :key="key"
        :id="key"
        :fields="formFields"
        :data="value"
        :open="key == open"
        @stage-value="stageValue"
        @open="openBox(key)"
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
      boxes: null,
      open: null
    };
  },
  components: {
    Box
  },
  computed: {
    formFields() {
      var fields = this.options.fields;
      this.$lodash.forOwn(fields, (value, key) => {
        fields[key].hidden_detail = false;
        fields[key].field = key;
      });
      return fields;
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
      this.$set(this.boxes, highest, {});

      this.$lodash.forOwn(this.options.fields, (value, key) => {
        this.boxes[highest][key] = null;
      });
      this.$emit("input", this.boxes);
    },
    stageValue({ id, data }) {
      this.$set(this.boxes[id], data.field, data.value);
      this.$emit("input", this.boxes);
    },
    openBox(id) {
      if (this.open == id) {
        this.open = null;
      } else {
        this.open = id;
      }
    }
  },
  created() {
    this.boxes = Object.assign({}, this.value) || {};
  }
};
</script>

<style lang="scss" scoped></style>
