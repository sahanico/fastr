<script>
import _ from 'underscore';
import EditorView from './studio/editor-view';

export default {
  props: ['design'],
  computed: {
    controls() {
      const controls = [];
      _.each(this.design.meta.layout, (control) => {
        controls.push(control);
      });
      return controls;
    },
  },
  created() {
    this.controls = this.$store.dispatch('getDesignByName', { name: this.screen.name });
  },
  render() {
    return (
      <EditorView
        width="100%"
        ref="editor"
        value={this.controls}
        context="read"
      >
      </EditorView>
    );
  },
};
</script>
