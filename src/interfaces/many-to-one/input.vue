<template>
  <div class="interface-many-to-one">
    <div v-if="relationSetup === false" class="notice">
      <p>
        <v-icon name="warning" />
        {{ $t("interfaces-many-to-many-relation_not_setup") }}
      </p>
    </div>

    <template v-else>
      <v-select
        :id="name"
        :name="name"
        :placeholder="options.placeholder || ''"
        :options="selectOptions"
        :disabled="readonly"
        :value="valuePK"
        :icon="options.icon"
        @input="$emit('input', $event)"
      ></v-select>

      <button v-if="count > options.threshold" type="button" @click="showListing = true"></button>

      <v-spinner
        v-show="loading"
        line-fg-color="var(--light-gray)"
        line-bg-color="var(--lighter-gray)"
        class="spinner"
      ></v-spinner>

      <v-item-select
        v-if="showListing"
        :collection="relation.collection_one.collection"
        :fields="relatedFields"
        :filters="[]"
        :selection="selection"
        single
        :value="valuePK"
        @input="emitValue"
        @close="closeListing"
      />
    </template>
  </div>
</template>

<script>
import mixin from "@directus/extension-toolkit/mixins/interface";
import getFieldsFromTemplate from "@/helpers/get-fields-from-template";

export default {
  name: "InterfaceManyToOne",
  mixins: [mixin],
  data() {
    return {
      loading: false,
      error: null,
      items: [],
      count: null,

      showListing: false,
      selectionSaving: false,
      newSelected: null
    };
  },
  computed: {
    relationSetup() {
      if (!this.relation) return false;
      return true;
    },
    relatedPrimaryKeyField() {
      return _.find(this.relation.collection_one.fields, {
        primary_key: true
      }).field;
    },
    valuePK() {
      if (_.isObject(this.value)) return this.value[this.relatedPrimaryKeyField];

      return this.value;
    },
    relatedFields() {
      return this.options.visible_fields.split(",").map(f => f.trim());
    },
    selection() {
      if (!this.value) return [];
      let visibleFields = this.options.visible_fields;

      // If the visible fields option hasn't been filled out, use the display template string instead
      if (!visibleFields || visibleFields.length === 0) {
        return getFieldsFromTemplate(this.options.template);
      }

      return visibleFields.split(",").map(f => f.trim());
    },
    render() {
      return this.$helpers.micromustache.compile(this.options.template);
    },
    selectOptions() {
      if (this.items.length === 0) return {};

      return _.mapValues(_.keyBy(this.items, this.relatedPrimaryKeyField), item =>
        this.render(item)
      );
    }
  },
  watch: {
    relation() {
      if (this.relationSetup) {
        this.fetchItems();
      }
    }
  },
  created() {
    if (this.relationSetup) {
      this.fetchItems();
    }

    this.onSearchInput = _.debounce(this.onSearchInput, 200);
  },
  methods: {
    emitValue(primaryKey) {
      this.$emit("input", primaryKey);
    },
    fetchItems() {
      if (this.relation == null) return;

      const collection = this.relation.collection_one.collection;

      this.loading = true;

      const params = {
        fields: "*.*",
        meta: "total_count",
        limit: this.options.threshold
      };

      return Promise.all([
        this.$api.getItems(collection, params),
        this.value ? this.$api.getItem(collection, this.valuePK) : null
      ])
        .then(([{ meta, data: items }, singleRes]) => {
          if (singleRes) {
            this.items = [...items, singleRes.data];
          } else {
            this.items = items;
          }

          this.loading = false;
          this.count = meta.total_count;
        })
        .catch(error => {
          console.error(error); // eslint-disable-line
          this.error = error;
          this.loading = false;
        });
    },
    dismissModal() {
      this.showListing = false;
      this.selectionSaving = false;
      this.newSelected = null;
    },
    setViewOptions(updates) {
      this.viewOptionsOverride = {
        ...this.viewOptionsOverride,
        ...updates
      };
    },
    setViewQuery(updates) {
      this.viewQueryOverride = {
        ...this.viewQueryOverride,
        ...updates
      };
    },
    onSearchInput(value) {
      this.setViewQuery({
        q: value
      });
    },
    closeListing() {
      this.fetchItems();
      this.showListing = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.interface-many-to-one {
  position: relative;
  max-width: var(--width-medium);
}

.v-select {
  margin-top: 0;
}

button {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  border: var(--input-border-width) solid var(--lighter-gray);
  border-radius: var(--border-radius);
  transition: border var(--fast) var(--transition);

  &:hover {
    transition: none;
    border-color: var(--light-gray);
  }
}

.spinner {
  position: absolute;
  right: -50px;
  top: 50%;
  transform: translateY(-50%);
}

.search {
  position: sticky;
  left: 0;
  top: 0;
  z-index: 2;
  background-color: var(--white);
  &-input {
    border-bottom: 1px solid var(--lightest-gray);
    padding: 12px;

    & >>> input {
      border-radius: 0;
      border: none;
      padding-left: var(--page-padding);
      height: var(--header-height);

      &::placeholder {
        color: var(--light-gray);
      }
    }
  }
}

.items {
  height: calc(100% - var(--header-height) - 1px);
}
</style>
