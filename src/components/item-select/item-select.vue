<template>
  <portal to="modal">
    <v-modal
      :title="$t('select_existing')"
      :buttons="{
        done: {
          text: $t('done'),
          color: 'accent'
        }
      }"
      @done="$emit('close')"
    >
      <div class="search-sort">
        <input
          :placeholder="$t('search')"
          :value="searchQuery"
          type="search"
          @input="setSearchQuery"
        />

        <div class="select">
          <select v-model="sortField">
            <option v-for="field in fields" :key="field" :value="field">
              {{ $helpers.formatTitle(field) }}
            </option>
          </select>
          <v-icon name="arrow_drop_down" color="light-gray" />
        </div>

        <div class="select">
          <select v-model="sortDirection">
            <option value="asc">{{ $t("asc") }}</option>
            <option value="desc">{{ $t("desc") }}</option>
          </select>
          <v-icon name="arrow_drop_down" color="light-gray" />
        </div>
      </div>

      <div v-if="loading" class="spinner">
        <v-spinner />
      </div>

      <div class="items">
        <div class="head">
          <!-- Checkboxes -->
          <span />
          <span v-for="field in fields" :key="field">{{ $helpers.formatTitle(field) }}</span>
        </div>
        <label v-for="item in items" :key="uid + '_' + item[primaryKeyField]">
          <div class="input">
            <input
              :type="single ? 'radio' : 'checkbox'"
              :name="uid"
              :value="item[primaryKeyField]"
              :checked="isChecked(item[primaryKeyField])"
              @change="updateValue"
            />
            <v-icon
              v-if="single"
              :name="
                isChecked(item[primaryKeyField]) ? 'radio_button_checked' : 'radio_button_unchecked'
              "
            />
            <v-icon
              v-else
              :name="isChecked(item[primaryKeyField]) ? 'check_box' : 'check_box_outline'"
            />
          </div>

          <span v-for="fieldInfo in fieldsWithInfo" :key="uid + '_' + fieldInfo.field">
            <v-ext-display
              :id="uid + '_' + fieldInfo.field"
              :interface-type="fieldInfo.interface"
              :name="uid + '_' + fieldInfo.field"
              :type="fieldInfo.type"
              :datatype="fieldInfo.datatype"
              :options="fieldInfo.options"
              :value="item[fieldInfo.field]"
            />
          </span>
        </label>
      </div>
    </v-modal>
  </portal>
</template>

<script>
import formatFilters from "@/helpers/format-filters";
import shortid from "shortid";

export default {
  name: "ItemSelect",
  props: {
    // The collection to fetch the items from. Has to be a string, eg `movies`
    collection: {
      type: String,
      required: true
    },

    // Array of fields to display in the table
    fields: {
      type: Array,
      required: true
    },

    // Array of filter objects in the app filter syntax. Allows the admin to setup what items to
    // show, eg
    //
    // [
    //   {
    //     "field": "title",
    //     "operator": "contains",
    //     "value": "directus"
    //   }
    // ]
    filters: {
      type: Array,
      default: () => []
    },

    // The current selection. In case of the single-selection mode this is a primary key, otherwise
    // it's an array of primary keys
    value: {
      type: [Array, String, Number],
      default: null
    },

    // Use single mode. This will use radio buttons instead of checkboxes so the user can only select
    // a single item
    single: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // The raw items fetched from the collection based on the filtes and fields that are requested
      items: [],

      // If the items are currently being loaded in
      loading: false,

      // Populated if something went wrong during the fetching of the items
      error: false,

      searchQuery: "",
      sortField: null,
      sortDirection: "asc"
    };
  },
  computed: {
    // The primary key field of the collection of which we're fetching items
    primaryKeyField() {
      const collection = this.$store.state.collections[this.collection];
      if (!collection) return null;
      return _.find(collection.fields, { primary_key: true }).field;
    },

    // Unique ID for this interface. Will be used in the name field of the inputs
    uid() {
      return shortid.generate();
    },

    // The fields array from props augmented with the fields information from directus_collections
    // Allows us to render the value in the display component of the interface that's setup for this
    // field
    fieldsWithInfo() {
      return this.fields.map(fieldName => {
        return this.$store.state.collections[this.collection].fields[fieldName];
      });
    }
  },

  // Re-fetch the items whenever the collection / filters prop changes
  watch: {
    collection() {
      this.fetchItems();
    },
    filters: {
      deep: true,
      handler() {
        this.fetchItems;
      }
    },
    sortField() {
      this.fetchItems();
    },
    sortDirection() {
      this.fetchItems();
    }
  },

  // Fetch the items on first load of the interface
  created() {
    this.sortField = this.fields[0];

    this.fetchItems();

    this.setSearchQuery = _.debounce(this.setSearchQuery, 200);
  },

  methods: {
    // Fetch the items based on the passed collection, filters, and fields prop
    fetchItems() {
      this.loading = true;
      this.error = null;

      const params = {};

      if (this.searchQuery.length > 0) {
        params.q = this.searchQuery;
      }

      if (this.filters.length > 0) {
        params.filters = formatFilters(this.filters);
      }

      if (this.fields.length > 0) {
        params.fields = _.clone(this.fields);
      }

      let sortString = "";
      if (this.sortDirection === "desc") sortString += "-";
      sortString += this.sortField;

      params.sort = sortString;

      // No matter what, always fetch the primary key as that's used for the selection
      params.fields.push(this.primaryKeyField);

      this.$api
        .getItems(this.collection, params)
        .then(res => res.data)
        .then(items => (this.items = items))
        .catch(error => (this.error = error))
        .finally(() => (this.loading = false));
    },

    // Stage the value to the parent component
    updateValue(event) {
      if (this.single) {
        return this.$emit("input", event.target.value);
      }
    },

    // Check if the provided primaryKey is included in the selection
    isChecked(primaryKey) {
      if (this.single) {
        // non-strict comparison. It might happen that the numeric id 1 is returned as '1' by the api
        return this.value == primaryKey;
      }
    },

    // Set the search query
    setSearchQuery(event) {
      this.searchQuery = event.target.value;
      this.fetchItems();
    }
  }
};
</script>

<style scoped>
.items {
  display: table;
  min-width: 100%;
  padding: 0 32px;
}
.items label:hover {
  background-color: var(--highlight);
  cursor: pointer;
}
.items label,
.items .head {
  display: table-row;
}
.head {
  position: sticky;
  display: block;
  top: 0px;
}
.items label > *,
.items .head > * {
  display: table-cell;
  border-bottom: 1px solid var(--lightest-gray);
  padding: 8px 32px 8px 0;
}
.input input,
.search-sort input[type="checkbox"] {
  position: absolute;
  left: -9999px;
  opacity: 0;
  visibility: hidden;
}
.spinner {
  width: 100%;
  padding: 80px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
}
.search-sort {
  display: flex;
  border-bottom: 1px solid var(--lightest-gray);
  padding: 8px 0;
  padding-right: 32px;
  align-items: center;
}
.search-sort input[type="search"] {
  flex-grow: 1;
  font-size: 1rem;
  border: none;
  border-radius: 0;
  padding: 8px 32px;
}
.search-sort .select {
  position: relative;
}
.search-sort select {
  appearance: none;
  background-color: transparent;
  margin-left: 16px;
  border: 1px solid var(--lightest-gray);
  padding: 4px 8px;
  padding-right: 20px;
  cursor: pointer;
}
.search-sort select:hover {
  border-color: var(--dark-gray);
}
.search-sort .select i {
  position: absolute;
  right: 0px;
  top: 2px;
  pointer-events: none;
}
</style>
