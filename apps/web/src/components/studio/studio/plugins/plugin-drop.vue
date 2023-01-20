<script>
import { EVENT_COMPONENT_ADD } from '../event-enums';

export default {
  props: {
    length: Number,
    parentId: String,
  },
  methods: {
    handleDropOver(e) {
      e.preventDefault();
      e.stopPropagation();
    },

    handleDragEnter(e) {
      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.effectAllowed = 'all';
      e.dataTransfer.dropEffect = 'move';
    },
    getImageDataUrl(file) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    },
    async handleDrop(e) {
      e.preventDefault();
      e.stopPropagation();
      // file drop
      // const files = e.dataTransfer.files;
      const addComponents = [];
      // const comstr = '';
      // 该功能给所有编辑视图提供，包括嵌套的编辑视图。
      // App.vue中添加到<EditorView></EditorView> 的插件仅提供给应用的顶层编辑视图
      const rect = this.$parent.getWrapperElement().getBoundingClientRect();
      const coords = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      // if (files.length > 0) {
      //   // eslint-disable-next-line no-plusplus
      //   for (let index = 0; index < files.length; index++) {
      //     const element = files[index];
      //     // eslint-disable-next-line no-await-in-loop
      //     const data = await this.getImageDataUrl(element);
      //     const type = element.name.split('.')[0].toLowerCase();
      addComponents.push({
        type: 'rich_textarea', // type
        url: '', // data
        ...coords,
        width: 150,
        height: 100,
        meta: {},
      });
      // }
      // eslint-disable-next-line no-cond-assign
      // } else if ((comstr = e.dataTransfer.getData('text/component'))) {
      //   let com = JSON.parse(comstr);
      //   com = { ...com, ...coords };
      //   addComponents.push(com);
      // }
      this.eventbus.$emit(EVENT_COMPONENT_ADD,
        { components: addComponents, parentId: this.parentId });
    },
  },
  mounted() {
    const element = this.$parent.getWrapperElement();
    element.addEventListener('dragenter', this.handleDragEnter, false);
    element.addEventListener('dragover', this.handleDropOver, false);
    element.addEventListener('drop', this.handleDrop, false);
  },
  render() {
    if (this.length > 0) return null;

    return (
      <div class="guide">
        <div>Drag component or local pictures to this area to start editing</div>
      </div>
    );
  },
};
</script>

<style lang="less" scoped>
.guide {
  left: 50%;
  top: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  color: #999;
  line-height: 2;
  font-size: 16px;
  font-weight: 300;
}
</style>
