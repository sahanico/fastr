<script>
import CellWrapperVue from './cell-wrapper';
import PluginDropFileVue from './plugins/plugin-drop';
import FormCreate from '../../forms/create';
import ListRead from '../../lists/read';
import ChartRead from '../../charts/read';
import RichTextRead from '../../fields/rich-text-area/rich-text-read';

export default {
  props: {
    value: Array,
    parentId: String,
    parent: Object,
    width: null,
    context: String,
  },
  methods: {
    /**
     * @type {HTMLElement}
     */
    getWrapperElement() {
      return this.$refs.editor;
    },
    handleChange(e) {
      this.$emit('change', e);
    },
    async getDesign(name) {
      this.designs = await this.$store.dispatch('getDesignsByType', {
        type: name,
      });
    },
  },
  render() {
    if (this.context === 'read') {
      return (

        <div>
          {this.value.map((item) => {
            switch (item.extra.type) {
              case 'form': return <FormCreate
                formName={item.extra.meta.design}
                key={item.id} item={item}
              />;
              case 'list': return <ListRead
                designName={item.extra.meta.design}/>;
              case 'chart': return <ChartRead name={item.extra.meta.design}/>;
              case 'video': return <youtube video-id={item.extra.meta.design}/>;
              case 'rich_textarea': return <RichTextRead design={item.extra.meta.design}/>;
              default: return <div>default</div>;
            }
          },
          )}
          {this.$slots.default}
        </div>
      );
    }
    return (
      <div style={`width: ${this.width}px; height: 100%; overflow: hidden;`}
        class={`vs-editor ${this.parentId ? 'nest-editor' : 'root-editor'}`}>
        <div class="vs-editor-canvas" ref="editor">
          {this.value.map(item =>
            <CellWrapperVue
              onChange={this.handleChange}
              key={item.id} item={item}
            />,
          )}
          { /** Inject Plugins */ }
          {this.$slots.default}
          <PluginDropFileVue parentId={this.parentId} length={this.value.length}/>
        </div>
      </div>
    );
  },
};
</script>

<style lang="less">

.vs-editor-canvas {
  width: 100%;
  height: 100%;
}

.root-editor > .vs-editor-canvas {
  transform: scale(1);
  transform-origin: top left;
}
</style>
