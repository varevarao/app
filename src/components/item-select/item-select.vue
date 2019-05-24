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
      <ol class="list"></ol>
    </v-modal>
  </portal>
</template>

<script>
import formatFilters from "@/helpers/format-filters";

export default {
  name: "ItemSelect",
  props: {
    /**
     * The collection to fetch the items from. Has to be a string, eg `movies`
     */
    collection: {
      type: String,
      required: true
    },

    /**
     * Array of fields to display in the table
     */
    fields: {
      type: Array,
      required: true
    },

    /**
     * Array of filter objects in the app filter syntax. Allows the admin to setup what items to
     * show, eg
     *
     * [
     *   {
     *     "field": "title",
     *     "operator": "contains",
     *     "value": "directus"
     *   }
     * ]
     */
    filters: {
      type: Array,
      default: () => []
    },

    /**
     * The current selection. In case of the single-selection mode this is a primary key, otherwise
     * it's an array of primary keys
     */
    selection: {
      type: [Array, String, Number],
      default: null
    }
  },
  data() {
    return {
      items: [],
      loading: false,
      error: false
    };
  },
  computed: {
    /**
     * The primary key field of the collection of which we're fetching items
     */
    primaryKeyField() {
      const collection = this.$store.state.collections[this.collection];
      if (!collection) return null;
      return _.find(collection.fields, { primary_key: true }).field;
    }
  },
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
  created() {
    this.fetchItems();
  },
  methods: {
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

<style scoped></style>
