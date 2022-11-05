<script>
import PropCheckInputVue from './prop-check-input';
import PropGridInputVue from './prop-grid-input';
import PropNumberInputVue from './prop-number-input';
import PropRadioInputVue from './prop-radio-input';
import Form from './props/form';

const PropInputImpl = {
  grid: PropGridInputVue,
  radio: PropRadioInputVue,
  number: PropNumberInputVue,
  checkbox: PropCheckInputVue,
  form: Form,
};
export default {
  props: ['controlled'],
  data() {
    return {
      inputs: [
        { type: 'number', name: 'x' },
        { type: 'number', name: 'y' },
        { type: 'number', name: 'width' },
        { type: 'number', name: 'height' },
        { type: 'number', name: 'rotation' },
        { type: 'number', name: 'minWidth' },
        { type: 'number', name: 'minHeight' },
        { type: 'grid', name: 'grid' },
        {
          type: 'radio',
          name: 'axis',
          options: [
            { label: 'y', value: 'y' },
            { label: 'x', value: 'x' },
            { label: 'xy', value: 'xy' }],
        },
        { type: 'checkbox', name: 'acceptRatio' },
        { type: 'checkbox', name: 'draggable' },
        { type: 'checkbox', name: 'resizable' },
        { type: 'checkbox', name: 'rotatable' },
        { type: 'checkbox', name: 'active' },
        { type: 'checkbox', name: 'parent' },
      ],
      extraInputs: [{ type: 'text', name: 'value' }, { type: 'text', name: 'label' }],
    };
  },
  methods: {
    customChange(e, item) {
      this.$emit('change', {
        ...item,
        value: e,
      });
    },
    extraChange(e) {
      this.$emit('change', {
        name: 'meta',
        value: e,
        extra: true,
      });
    },
  },
  render() {
    return (
      <div class="vs-inspector">
        <div class="headline text-xs-center red--text pb-5 pt-5">Configure</div>
        {
          // this.controlled &&
          // this.controlled.type === 'form' &&
          // this.controlled.extra &&
          // <Form
          //   onInput={e => this.extraChange(e, 'meta')}
          //   controlled={this.controlled}
          // />
        }
        <div class="headline text-xs-center red--text pb-5 pt-5">Transform</div>
        {this.inputs.map((item) => {
          // eslint-disable-next-line
          let DyInput = PropInputImpl[item.type];
          return (
            <div class="input-item" key={item.name}>
              <label class="input-label">{item.name}</label>
              <DyInput
                options={item.options}
                value={this.controlled[item.name]}
                onInput={e => this.customChange(e, item)}
              />
            </div>
          );
        })}
      </div>
    );
  },
};
</script>

<style lang="less">
.vs-inspector {
  width: 240px;
  border-left: 1px solid #ececec;
  background: #f8f8f8;
  padding: 15px;
  overflow-y: auto;

  .input-item {
    margin-bottom: 12px;
    display: flex;
  }

  .input-label {
    display: inline-block;
    width: 100px;
    color: #555;
  }

  .input-value:not([type='checkbox']) {
    height: 24px;
    padding: 0;
    border-radius: 0;
    border: 1px solid #d3d3d3;
    padding-left: 10px;
    flex: 1;
    width: 0;
  }
}
</style>
