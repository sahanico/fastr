<script>
export default {
  props: {
    value: Boolean,
  },

  methods: {
    handleChange(v) {
      this.$emit('input', v);
    },
  },
  render() {
    return (
      <label>
        <input
          class="input-value"
          checked={this.value}
          onInput={e => this.handleChange(e.target.checked)}
          type="checkbox"
        />
      </label>
    );
  },
};
</script>
