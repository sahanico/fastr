<script>
import {
  EVENT_APPLICATION_CLEAR,
  EVENT_APPLICATION_REDO,
  EVENT_APPLICATION_UNDO,
  EVENT_COMPONENT_DELETE,
  EVENT_COMPONENT_DUPLICATE,
  EVENT_SUBMIT_SCREEN,
} from './event-enums';

export default {
  methods: {},
  render() {
    return (
      <div class="vs-header">
        <h1 class="headline text-xs-center red--text pb-5 pt-5">Studio</h1>
        <div class="header-actions">
          <v-btn
            title="Return to the previous state"
            data-action="undo"
            onClick={() => this.eventbus.$emit(EVENT_APPLICATION_UNDO)}>
            Undo
          </v-btn>
          <v-btn
            title="Return to the next state"
            data-action="redo"
            onClick={() => this.eventbus.$emit(EVENT_APPLICATION_REDO)}>
            Redo
          </v-btn>
          <v-btn
            title="Duplicate selected component"
            data-action="duplicate"
            onClick={() => this.eventbus.$emit(EVENT_COMPONENT_DUPLICATE)}>
            Duplicate
          </v-btn>
          <v-btn
            title="Delete selected component"
            data-action="delete"
            onClick={() => this.eventbus.$emit(EVENT_COMPONENT_DELETE)}>
            Delete
          </v-btn>
          <v-btn
            title="Clear all components in the editing area"
            data-action="clear"
            onClick={() => this.eventbus.$emit(EVENT_APPLICATION_CLEAR)}>
            Clear
          </v-btn>
          <v-btn
            title="Clear all components in the editing area"
            data-action="clear"
            color="red"
            dark
            onClick={() => this.eventbus.$emit(EVENT_SUBMIT_SCREEN)}>
            Submit
          </v-btn>
        </div>
      </div>
    );
  },
};
</script>

<style lang="less">
.vs-header {
  height: 50px;
  border-bottom: 1px solid #ececec;
  display: flex;
  align-items: center;
  background: #f8f8f8;
  h1 {
    text-align: center;
    font-size: 20px;
    color: #333;
    font-weight: 300;
    width: 200px;
  }
  .header-actions {
    display: flex;
    align-items: center;
  }
  //button {
  //  padding: 5px 12px;
  //  font-size: 16px;
  //  color: #555;
  //  background: #eee;
  //  background-image: linear-gradient(to bottom, #fcfcfc 0, #eee 100%);
  //  border: 1px solid #d5d5d5;
  //  margin-right: 20px;
  //  border-radius: 4px;
  //  &:hover {
  //    background: #ddd;
  //    cursor: pointer;
  //    transition: all 300ms;
  //    background-image: linear-gradient(to bottom, #eee 0, #ddd 100%);
  //  }
  //}
}
</style>
