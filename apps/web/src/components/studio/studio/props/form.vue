<script>
import _ from 'underscore';

export default {
  props: ['controlled'],
  data() {
    return {
      forms: [],
    };
  },
  computed: {
    autocompleteForms() {
      if (this.forms.length === 0) return [];
      return _.map(this.forms, form => ({
        text: form.label,
        value: form.name,
      }));
    },
    renderAutocomplete() {
      if (!this.controlled && !this.controlled.extra.meta.design) return <div />;
      return (
        <v-autocomplete
          items={this.autocompleteForms}
          onChange={e => this.handleChange(e)}
          label="Select Form"
          modelValue={this.controlled.extra.meta.design}
        />
      );
    },
  },
  methods: {
    handleChange(v) {
      this.$emit('input', {
        design: v,
      });
    },
  },
  async created() {
    this.forms = await this.$store.dispatch('getDesignsByType', { type: 'form' });
  },
  render() {
    return (
      <div>
        <label>
          {this.renderAutocomplete}
        </label>
      </div>
    );
  },
};
</script>
