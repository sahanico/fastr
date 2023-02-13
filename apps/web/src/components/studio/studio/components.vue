<script>
import Logo from '../studio/assets/logo.png';

export default {
  data() {
    return {
      components: [
        {
          type: 'form',
          value: 'form',
          name: 'Form',
          width: 150,
          height: 30,
          meta: {},
        },
        {
          type: 'list',
          value: 'list',
          inputType: 'list',
          name: 'List',
          width: 150,
          height: 30,
        },
        {
          type: 'request',
          options: [],
          name: 'Request',
          width: 150,
          height: 30,
        },
        {
          type: 'image',
          name: 'Image',
          url: Logo,
          width: 100,
          height: 100,
        },
        {
          type: 'rich_textarea',
          inputType: 'rich_textarea',
          name: 'Rich Textarea',
          label: 'Rich Textarea',
          width: 100,
          height: 30,
        },
        {
          type: 'button',
          inputType: 'button',
          name: 'Button',
          label: 'Button',
          width: 100,
          height: 30,
        },
        {
          type: 'chart',
          inputType: 'chart',
          name: 'Chart',
          value: 'Chart',
          width: 100,
          height: 30,
        },
        {
          type: 'video',
          inputType: 'video',
          name: 'Video',
          value: 'Video',
          width: 100,
          height: 30,
        },
        {
          type: 'point',
          inputType: 'point',
          name: 'Point',
          value: 'Poiunt',
          width: 100,
          height: 30,
        },
        {
          type: 'tabs',
          inputType: 'tabs',
          name: 'Tabs',
          value: 'Tabs',
          width: 100,
          height: 30,
        },
        {
          type: 'calendar',
          inputType: 'calendar',
          name: 'Calendar',
          value: 'Calendar',
          width: 100,
          height: 30,
        },
        {
          type: 'container',
          name: 'Container',
          width: 200,
          height: 200,
          children: [],
        },
        {
          type: 'input',
          inputType: 'checkbox',
          name: 'Checkbox',
          label: 'Checkbox',
          width: 100,
          height: 30,
        },
      ],
    };
  },
  methods: {
    handleDrag(e, item) {
      e.dataTransfer.dropEffect = 'copy';
      e.dataTransfer.setData('text/component', JSON.stringify(item));
    },
  },
  render() {
    return (
      <div class="vs-components">
        {this.components.map((item, index) => (
          <div ondragstart={e => this.handleDrag(e, item)} draggable="true"
            class="components-item" key={index}>
            <img class="components-icon"
              src={require(`../studio/assets/${item.inputType || item.type}.png`)}/>
            {item.name}
          </div>
        ))}
      </div>
    );
  },
};
</script>

<style lang="less" scoped>
.vs-components {
  width: 200px;
  border-right: 1px solid #ececec;
  position: relative;
  overflow-y: scroll;
  background: #f8f8f8;

  &::-webkit-scrollbar {
    display: none;
  }

  .components-icon {
    width: 35px;
    height: 35px;
    margin-bottom: 6px;
  }
}

.components-item {
  height: 100px;
  width: 50%;
  float: left;
  display: flex;

  &:nth-child(2n + 1) {
    border-right: 1px solid #ececec;
  }

  border-bottom: 1px solid #ececec;
  align-items: center;
  justify-content: center;
  cursor: move;
  flex-direction: column;
  font-weight: 300;

  &:hover {
    background: #fff;
  }
}
</style>
