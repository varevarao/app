<template>
  <portal to="modal">
    <v-modal
      :title="$t('select_existing')"
      :buttons="{
        save: {
          text: $t('done'),
          color: 'accent'
        }
      }"
    >
      <div class="search-sort"></div>
      <div class="items">
        <label v-for="item in items" :key="uid + '_' + item[primaryKeyField]">
          <input type="checkbox" :name="uid" :value="item[primaryKeyField]" />

          <v-ext-display
            v-for="fieldInfo in fieldsWithInfo"
            :id="uid + '_' + fieldInfo.field"
            :key="uid + '_' + fieldInfo.field"
            :interface-type="fieldInfo.interface"
            :name="uid + '_' + fieldInfo.field"
            :type="fieldInfo.type"
            :datatype="fieldInfo.datatype"
            :options="fieldInfo.options"
            :value="item[fieldInfo.field]"
          />
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
    selection: {
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
      error: false
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

  // Re-fetch the items whenever the collection or filters prop changes
  watch: {
    collection() {
      this.fetchItems();
    },
    filters: {
      deep: true,
      handler() {
        this.fetchItems;
      }
    }
  },

  // Fetch the items on first load of the interface
  created() {
    this.fetchItems();
  },

  methods: {
    // Fetch the items based on the passed collection, filters, and fields prop
    fetchItems() {
      this.loading = true;
      this.error = null;

      const params = {};

      if (this.filters.length > 0) {
        params.filters = formatFilters(this.filters);
      }

      if (this.fields.length > 0) {
        params.fields = _.clone(this.fields);
      }

      // No matter what, always fetch the primary key as that's used for the selection
      params.fields.push(this.primaryKeyField);

      this.$api
        .getItems(this.collection, params)
        .then(res => res.data)
        .then(items => (this.items = items))
        .catch(error => (this.error = error))
        .finally(() => (this.loading = false));
    }
  }
};
</script>

<style scoped>
.items {
  display: table;
}
.items label {
  display: table-row;
}
.items label > * {
  display: table-cell;
  padding: 8px;
}
</style>
