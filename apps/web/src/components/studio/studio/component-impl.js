import EditorView from './editor-view';
import DesignSettings from './editor/design-settings';
import ReadDesign from './editor/read-design';

const Img = {
  props: {
    params: {
      default: () => ({}),
    },
  },
  render() {
    return <img draggable="false" class="match-parent" src={this.params.url}/>;
  },
};
const Label = {
  props: {
    params: {
      default: () => ({}),
    },
  },
  render() {
    return (
      <div draggable="false" class="match-parent">
        {this.params.value}
      </div>
    );
  },
};

const Container = {
  props: {
    params: {
      default: () => ({}),
    },
    meta: {
      default: () => ({ children: [] }),
    },
  },
  render() {
    return (
      <div style="border:1px solid #d4d4d4" draggable="false" class="match-parent">
        <EditorView parentId={this.meta.id} value={this.meta.children}/>
      </div>
    );
  },
};

const Input = {
  props: {
    params: {
      default: () => ({
        value: '',
        type: 'input',
      }),
    },
  },
  render() {
    if (['checkbox', 'radio'].includes(this.params.inputType)) {
      return (
        <label class="match-parent input-has-label">
          <input type={this.params.inputType} value={this.params.value}/>
          {this.params.label}
        </label>
      );
    }
    return <input class="match-parent" type={this.params.inputType} value={this.params.value}/>;
  },
};

const Select = {
  props: {
    params: {
      default: () => ({
        value: '',
        options: [{ label: 'text', value: 'text' }],
      }),
    },
  },
  render() {
    return (
      <select class="match-parent" type={this.params.type} value={this.params.url}>
        {this.params.options.map(item => (
          <option value={item.value} key={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    );
  },
};

const Rect = {
  render() {
    return <div class="match-parent" class="rect"/>;
  },
};

const form = {
  components: { DesignSettings, ReadDesign },
  props: {
    params: {
      default: () => ({
      }),
    },
    meta: Object,
  },
  data: () => ({
    showDialog: false,
    renderReadDesign: false,
  }),
  computed: {
    renderReadDesigner() {
      if (this.renderReadDesign) {
        return <ReadDesign design={this.params.meta.design} />;
      }
      return <div />;
    },
  },
  methods: {
    clickSettings() {
      this.showDialog = true;
    },
    submitSettings(data) {
      this.showDialog = false;
      this.params = {
        ...this.params,
        meta: { ...data },
      };
      this.renderReadDesign = true;
      this.$emit('change', {
        name: 'meta',
        value: data,
        extra: true,
      });
    },
  },
  render() {
    return <div draggable="false" style="border: dashed; height: 100%; border-color: gray">
      <v-icon style="position: absolute; top: 4px; right: 4px"
        onClick={this.clickSettings}>
        mdi-wrench
      </v-icon>
      <DesignSettings
        showDialog={this.showDialog}
        type={this.params.type}
        onSubmitSettings={this.submitSettings}
      />
      {this.renderReadDesigner}
    </div>;
  },
};

const list = {
  components: { DesignSettings, ReadDesign },
  props: {
    params: {
      default: () => ({
      }),
    },
    meta: Object,
  },
  data: () => ({
    showDialog: false,
    renderReadDesign: false,
  }),
  computed: {
    renderReadDesigner() {
      if (this.renderReadDesign) {
        return <ReadDesign design={this.params.meta.design} type={this.params.type} />;
      }
      return <div />;
    },
  },
  methods: {
    clickSettings() {
      this.showDialog = true;
    },
    submitSettings(data) {
      this.showDialog = false;
      this.params = {
        ...this.params,
        meta: { ...data },
      };
      this.renderReadDesign = true;
      this.$emit('change', {
        name: 'meta',
        value: data,
        extra: true,
      });
    },
  },
  render() {
    return <div draggable="false" style="border: dashed; height: 100%; border-color: gray">
      <v-icon style="position: absolute; top: 4px; right: 4px"
        onClick={this.clickSettings}>
        mdi-wrench
      </v-icon>
      <DesignSettings
        showDialog={this.showDialog}
        type={this.params.type}
        onSubmitSettings={this.submitSettings}
      />
      {this.renderReadDesigner}
    </div>;
  },
};

const chart = {
  components: { DesignSettings, ReadDesign },
  props: {
    params: {
      default: () => ({
      }),
    },
    meta: Object,
  },
  data: () => ({
    showDialog: false,
    renderReadDesign: false,
  }),
  computed: {
    renderReadDesigner() {
      if (this.renderReadDesign) {
        return <ReadDesign design={this.params.meta.design} type={this.params.type} />;
      }
      return <div />;
    },
  },
  methods: {
    clickSettings() {
      this.showDialog = true;
    },
    submitSettings(data) {
      this.showDialog = false;
      this.params = {
        ...this.params,
        meta: { ...data },
      };
      this.renderReadDesign = true;
      this.$emit('change', {
        name: 'meta',
        value: data,
        extra: true,
      });
    },
  },
  render() {
    return <div draggable="false" style="border: dashed; height: 100%; border-color: gray">
      <v-icon style="position: absolute; top: 4px; right: 4px" onClick={this.clickSettings}>
        mdi-wrench
      </v-icon>
      <DesignSettings
        showDialog={this.showDialog}
        type={this.params.type}
        onSubmitSettings={this.submitSettings}
      />
      {this.renderReadDesigner}
    </div>;
  },
};

const video = {
  components: { DesignSettings, ReadDesign },
  props: {
    params: {
      default: () => ({
      }),
    },
    meta: Object,
  },
  data: () => ({
    showDialog: false,
    renderReadDesign: false,
  }),
  computed: {
    renderReadDesigner() {
      if (this.renderReadDesign) {
        return <ReadDesign design={this.params.meta.design} type={this.params.type} />;
      }
      return <div />;
    },
  },
  methods: {
    clickSettings() {
      this.showDialog = true;
    },
    submitSettings(data) {
      this.showDialog = false;
      this.params = {
        ...this.params,
        meta: { ...data },
      };
      this.renderReadDesign = true;
      this.$emit('change', {
        name: 'meta',
        value: data,
        extra: true,
      });
    },
  },
  render() {
    return <div draggable="false" style="border: dashed; height: 100%; border-color: gray">
      <v-icon style="position: absolute; top: 4px; right: 4px"
        onClick={this.clickSettings}>
            mdi-wrench
      </v-icon>
      <DesignSettings
        showDialog={this.showDialog}
        type={this.params.type}
        onSubmitSettings={this.submitSettings}
      />
      {this.renderReadDesigner}
    </div>;
  },
};
const richTextArea = {
  components: { DesignSettings, ReadDesign },
  props: {
    params: {
      default: () => ({
      }),
    },
    meta: Object,
  },
  data: () => ({
    showDialog: false,
    renderReadDesign: false,
  }),
  computed: {
    renderReadDesigner() {
      if (this.renderReadDesign) {
        return <ReadDesign design={this.params.meta.design} type={this.params.type} />;
      }
      return <div />;
    },
  },
  methods: {
    clickSettings() {
      this.showDialog = true;
    },
    submitSettings(data) {
      this.showDialog = false;
      this.params = {
        ...this.params,
        meta: { ...data },
      };
      this.renderReadDesign = true;
      this.$emit('change', {
        name: 'meta',
        value: data,
        extra: true,
      });
    },
  },
  render() {
    return <div draggable="false" style="border: dashed; height: 100%; border-color: gray">
      <v-icon style="position: absolute; top: 4px; right: 4px"
        onClick={this.clickSettings}>
        mdi-wrench
      </v-icon>
      <DesignSettings
        showDialog={this.showDialog}
        type={this.params.type}
        onSubmitSettings={this.submitSettings}
      />
      {this.renderReadDesigner}
    </div>;
  },
};
export default {
  img: Img,
  input: Input,
  select: Select,
  rect: Rect,
  label: Label,
  container: Container,
  form,
  list,
  chart,
  video,
  rich_textarea: richTextArea,
};
