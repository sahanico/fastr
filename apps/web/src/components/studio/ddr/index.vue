<script>
import {
  getHandler,
  getPoints,
  getSize,
  handlerPointMap,
  heightMap,
  pointMap,
  pointMap2,
  rad2deg,
  tr2bl,
  widthMap,
} from './helper';

export default {
  name: 'ddr',
  props: {
    value: {
      default() {
        return { x: 0, y: 0, width: 100, height: 100, rotation: 0 };
      },
      type: Object,
    },
    handlerSize: {
      type: Number,
      default: 11,
    },
    active: {
      default: true,
      type: Boolean,
    },
    resizeHandler: {
      default() {
        return ['tl', 'tm', 'tr', 'r', 'br', 'bm', 'bl', 'l'];
      },
      type: Array,
    },
    resizable: {
      default: true,
      type: Boolean,
    },
    rotatable: {
      default: true,
      type: Boolean,
    },
    draggable: {
      default: true,
      type: Boolean,
    },
    acceptRatio: {
      default: false,
      type: Boolean,
    },
    minWidth: {
      type: Number,
      default: 1,
    },
    minHeight: {
      type: Number,
      default: 1,
    },
    maxWidth: {
      type: Number,
      default: 100000000,
    },
    maxHeight: {
      type: Number,
      default: 100000000,
    },
    parent: {
      type: Boolean,
      default: false,
    },
    beforeActive: {
      type: Function,
      default: () => false,
    },
    id: [Number, String],
    renderContent: Function,
    grid: {
      type: Array,
      default: () => [30, 30],
    },
    stop: {
      default: true,
      type: Boolean,
    },
    prevent: {
      default: true,
      type: Boolean,
    },
    zoom: {
      default: 1,
      type: Number,
    },
    axis: {
      type: String,
      default: 'xy', // x | y 不填写则都可以移动，仅移动时生效
    },
  },
  data() {
    return {
      transform: Object.assign({}, this.value),
      currentRatio: 1,
      isInitialRatio: false,
      isDragging: false,
      isResizing: false,
      isRotating: false,
      isReadyToDrag: false,
      isReadyToResize: false,
      isReadyToRotate: false,
    };
  },
  created() {
    // 缓存当前位置信息
    this.localeTransform = { ...this.transform };
  },
  watch: {
    value(t) {
      this.transform = { ...t };
    },
  },

  computed: {
    rotateHandler() {
      const size = `${Math.ceil(this.handlerSize / this.zoom)}px`;
      return `width:${size};height:${size};top:-25px;margin-left:${-Math.floor(
        this.handlerSize / 2)}px`;
    },
    style() {
      const transform = this.transform;
      return `left:${transform.x}px;top:${transform.y}px;width:${transform.width}px;height:${
        transform.height
      }px;transform:rotate(${transform.rotation}deg)`;
    },
  },
  methods: {
    handleDefaultEvent(e) {
      if (this.stop) {
        e.stopPropagation();
      }
      if (this.prevent) {
        e.preventDefault();
      }
    },
    getNewHandler(type) {
      const cursor = getHandler(type, this.transform.rotation);
      const { handlerSize } = this;
      let props = {};
      const half = `${-Math.floor(handlerSize / 2)}px`;
      switch (type) {
        case 'tl':
          props = {
            top: half,
            left: half,
          };
          break;
        case 'tm':
          props = { top: half, 'margin-left': half };
          break;
        case 'tr':
          props = { right: half, top: half };
          break;
        case 'r':
          props = { right: half, 'margin-top': half };
          break;
        case 'br':
          props = { bottom: half, right: half };
          break;
        case 'bm':
          props = { 'margin-left': half, bottom: half };
          break;
        case 'bl':
          props = { left: half, bottom: half };
          break;
        case 'l':
          props = { 'margin-top': half, left: half };
          break;
        default:
          break;
      }
      const result = {
        cursor: `${cursor}-resize`,
        width: `${Math.ceil(handlerSize / this.zoom)}px`,
        height: `${Math.ceil(handlerSize / this.zoom)}px`,
        ...props,
      };
      return Object.keys(result).map(item => `${item}:${result[item]}`).join(';');
    },
    emitChange() {
      this.$emit('input', { ...this.transform });
    },
    handleMouseDown(event) {
      if (!this.active && !this.beforeActive(this.id)) return;
      this.handleDefaultEvent(event);
      const point = event.touches ? event.touches[0] : event;
      const { clientX, clientY } = point;
      // eslint-disable-next-line no-underscore-dangle
      this._lastX = clientX;
      // eslint-disable-next-line no-underscore-dangle
      this._lastY = clientY;
      // eslint-disable-next-line no-underscore-dangle
      this._activeTarget = event.target;
      // eslint-disable-next-line no-underscore-dangle
      this._parentRect = this.$refs.wrapper.parentNode.getBoundingClientRect();
      // eslint-disable-next-line no-underscore-dangle
      this._resizeHandler = event.target.dataset.resizetype;
      this.localeTransform = { ...this.transform };
      // 如果设置了限制在父元素的边界内移
      // 计算组件的边界，在移动时进行判断并修正
      if (this.parent) {
        const minLeft = 0;
        // eslint-disable-next-line no-underscore-dangle,no-mixed-operators
        const maxLeft = this._parentRect.width / this.zoom - this.transform.width;
        const minTop = 0;
        // eslint-disable-next-line no-underscore-dangle,no-mixed-operators
        const maxTop = this._parentRect.height / this.zoom - this.transform.height;
        const maxLeftWidth = this.transform.x + this.transform.width;
        // eslint-disable-next-line no-underscore-dangle,no-mixed-operators
        const maxRightWidth = this._parentRect.width / this.zoom - this.transform.x;
        const maxTopHeight = this.transform.y + this.transform.height;
        // eslint-disable-next-line no-underscore-dangle,no-mixed-operators
        const maxBottomHeight = this._parentRect.height / this.zoom - this.transform.y;
        this.bounday = {
          minLeft,
          maxLeft,
          minTop,
          maxTop,
          maxLeftWidth,
          maxRightWidth,
          maxTopHeight,
          maxBottomHeight,
        };
      }
      // 添加事件，该事件会在up时移除
      document.addEventListener('mousemove', this.handleMouseMove, false);
      document.addEventListener('touchmove', this.handleMouseMove, false);
      document.addEventListener('touchend', this.handleMouseUp, false);
      document.addEventListener('mouseup', this.handleMouseUp, false);
      if (event.target.dataset.type === 'rotate') {
        // eslint-disable-next-line no-underscore-dangle
        this._handlerType = 'rotate';
        this.isReadyToRotate = true;
        this.handleRotateStart(event);
        this.$emit('rotatestart', event, this.transform);
        // eslint-disable-next-line no-underscore-dangle
      } else if (this._activeTarget.dataset.resizetype) {
        // eslint-disable-next-line no-underscore-dangle
        this._handlerType = 'resize';
        this.isReadyToResize = true;
        this.handleResizeStart(event);
        this.$emit('resizestart', event, this.transform);
      } else {
        // eslint-disable-next-line no-underscore-dangle
        this._handlerType = 'drag';
        this.isReadyToDrag = true;
        // eslint-disable-next-line no-unused-expressions
        this.draggable && this.$emit('dragstart', event, this.transform);
      }
    },
    handleMouseMove(event) {
      this.handleDefaultEvent(event);
      const { clientX, clientY } = event.touches ? event.touches[0] : event;
      this.isReadyToDrag = false;
      this.isReadyToResize = false;
      this.isReadyToRotate = false;
      // eslint-disable-next-line no-underscore-dangle
      this._deltaX = clientX - this._lastX;
      // eslint-disable-next-line no-underscore-dangle
      this._deltaY = clientY - this._lastY;
      // eslint-disable-next-line no-underscore-dangle
      this._lastX = clientX;
      // eslint-disable-next-line no-underscore-dangle
      this._lastY = clientY;
      // eslint-disable-next-line no-underscore-dangle
      if (this._handlerType === 'resize') {
        this.isResizing = true;
        this.handleResizeMove(event);
        this.$emit('resize', event, this.transform);
        // eslint-disable-next-line no-underscore-dangle
      } else if (this._handlerType === 'drag' && this.draggable) {
        this.isDragging = true;
        this.doMove(event);
        this.$emit('drag', event, this.transform);
        // eslint-disable-next-line no-underscore-dangle
      } else if (this._handlerType === 'rotate') {
        this.isRotating = true;
        this.handleRotateMove(event);
        this.$emit('rotate', event, this.transform);
      }
      this.emitChange();
    },

    doMove() {
      const [gridX, gridY] = this.grid;
      // eslint-disable-next-line no-underscore-dangle
      const deltaX = this._deltaX / this.zoom;
      // eslint-disable-next-line no-underscore-dangle
      const deltaY = this._deltaY / this.zoom;
      // eslint-disable-next-line no-multi-assign
      const x = (this.localeTransform.x = Math.round(this.localeTransform.x + deltaX));
      // eslint-disable-next-line no-multi-assign
      const y = (this.localeTransform.y = Math.round(this.localeTransform.y + deltaY));

      // 将当前位置对齐网格，限制在父元素内进行移动
      // 当deltaX > 0 说明当前移动方向为向右移动，则向下取整。例如：10 12 14 始终取 10
      // 当deltaY < 0 说明当干移动方向为向左移动，则向上取整。例如：20 19 17 始终取 20
      if (this.axis.includes('x')) {
        if (x > this.transform.x) {
          this.transform.x = this.restrictToLeftOfParent(x - (x % gridX));
        } else if (x < this.transform.x) {
          this.transform.x = this.restrictToLeftOfParent(x - ((x % gridX) - gridX));
        }
      }

      if (this.axis.includes('y')) {
        if (y > this.transform.y) {
          this.transform.y = this.restrictToTopOfParent(y - (y % gridY));
        } else if (y < this.transform.y) {
          this.transform.y = this.restrictToTopOfParent(y - ((y % gridY) - gridY));
        }
      }
    },
    restrictToLeftOfParent(x) {
      if (!this.parent) return x;
      // eslint-disable-next-line no-param-reassign
      x = Math.max(this.bounday.minLeft, x);
      // eslint-disable-next-line no-param-reassign
      x = Math.min(this.bounday.maxLeft, x);
      return x;
    },
    restrictToTopOfParent(y) {
      if (!this.parent) return y;
      // eslint-disable-next-line no-param-reassign
      y = Math.max(this.bounday.minTop, y);
      // eslint-disable-next-line no-param-reassign
      y = Math.min(this.bounday.maxTop, y);
      return y;
    },
    restrictHeight(h, type) {
      if (!this.parent || this.transform.rotation > 0) return h;
      if (['bl', 'bm', 'br'].includes(type)) return Math.min(this.bounday.maxBottomHeight, h);
      if (['tl', 'tm', 'tr'].includes(type)) return Math.min(this.bounday.maxTopHeight, h);
      return h;
    },
    restrictWidth(w, type) {
      if (!this.parent || this.transform.rotation > 0) return w;
      if (['tl', 'l', 'bl'].includes(type)) return Math.min(this.bounday.maxLeftWidth, w);
      if (['tr', 'r', 'br'].includes(type)) return Math.min(this.bounday.maxRightWidth, w);
      return w;
    },
    handleMouseUp(event) {
      this.handleDefaultEvent(event);
      document.removeEventListener('mousemove', this.handleMouseMove, false);
      document.removeEventListener('mouseup', this.handleMouseUp, false);
      document.removeEventListener('touchmove', this.handleMouseMove, false);
      document.removeEventListener('touchend', this.handleMouseUp, false);

      const ev = {
        drag: 'draggable',
        resize: 'resizable',
        rotate: 'rotatable',
      };

      // eslint-disable-next-line no-multi-assign
      this.isInitialRatio = this.isDragging = this.isResizing = this.isRotating = false;
      // eslint-disable-next-line no-multi-assign
      this.isReadyToDrag = this.isReadyToResize = this.isReadyToRotate = false;
      // eslint-disable-next-line no-unused-expressions,no-underscore-dangle
      this[ev[this._handlerType]] && this.$emit(`${this._handlerType}end`, event, this.transform);
    },
    handleResizeStart(event) {
      // eslint-disable-next-line no-underscore-dangle
      const type = this._resizeHandler;
      const rect = this.transform;
      const matrix = getPoints(rect, this.zoom);
      let pressAngle;
      // 当前控制点的对角坐标点，该坐标会用来计算新的位置
      // 例如：bottomRight(右下角) 对应 topLeft(左上角)
      const opposite = matrix[pointMap[type]];
      // 与上面的区别是，这里的对角坐标只能是4个直角坐标，用于计算新的宽高
      // 例如：例如：bottomRight 和 bottom 都对应 topLeft
      const opp2 = matrix[pointMap2[type]];
      const { clientX, clientY } = event.touches ? event.touches[0] : event;
      // issues: https://github.com/zuimeiaj/yoyoo-ddr/issues/34
      // 在进行缩放时，需要考虑鼠标位置距离拖拽点中心位置的偏移值，否则拖拽时会有抖动
      const handlerPoint = matrix[handlerPointMap[type]];
      const offsetX = clientX - handlerPoint.x;
      const offsetY = clientY - handlerPoint.y;

      const x1 = clientX - opp2.x - offsetX;
      const y1 = clientY - opp2.y - offsetY;
      const width = rect.width;
      const height = rect.height;
      // 有问题
      if (tr2bl[type]) {
        pressAngle = rad2deg(Math.atan2(width, widthMap[type] ? height / 2 : height));
      } else {
        pressAngle = rad2deg(Math.atan2(height, heightMap[type] ? width / 2 : width));
      }
      const startAngle = rad2deg(Math.atan2(y1, x1));
      // eslint-disable-next-line no-underscore-dangle
      this._resizeOpt = {
        matrix,
        rect,
        type,
        opposite,
        opp2,
        pressAngle,
        startAngle,
        offsetX,
        offsetY,
      };
    },
    handleResizeMove(event) {
      const { clientX, clientY } = event.touches ? event.touches[0] : event;
      // eslint-disable-next-line no-underscore-dangle
      const { opposite, opp2, type, pressAngle, startAngle, offsetX, offsetY } = this._resizeOpt;
      const x = clientX - opp2.x - offsetX;
      const y = clientY - opp2.y - offsetY;
      const dis = Math.hypot(y, x);
      const ratio = event.shiftKey || this.acceptRatio;
      const [gridX, gridY] = this.grid;
      // 锁定纵横比
      if (!this.isInitialRatio && ratio) {
        this.currentRatio = this.transform.width / this.transform.height;
        this.isInitialRatio = true;
      }
      if (!ratio) {
        this.isInitialRatio = false;
      }

      // 获取新的宽度和高度
      let { w, h } = getSize({
        type,
        dis,
        x,
        y,
        startAngle,
        pressAngle,
      });
      const transform = { ...this.localeTransform };

      // 进行等比例缩放
      if (this.isInitialRatio) {
        if (widthMap[type]) h = w / this.currentRatio;
        else w = h * this.currentRatio;
      }
      // 还原到实际尺寸
      w /= this.zoom;
      h /= this.zoom;
      w = Math.min(Math.max(Math.round(w), this.minWidth), this.maxWidth);
      h = Math.min(Math.max(Math.round(h), this.minHeight), this.maxHeight);
      // 判断当前控制点是否为宽度缩放还是高度缩放
      if (widthMap[type] && !ratio) {
        transform.width = w;
      } else if (heightMap[type] && !ratio) {
        transform.height = h;
      } else {
        transform.width = w;
        transform.height = h;
      }

      // eslint-disable-next-line no-underscore-dangle
      const resizeType = this._resizeHandler;
      // // 限制在网格中移动，原理同拖动
      if (transform.width % gridX > 0) {
        if (transform.width > this.localeTransform.width) {
          // 宽度变大时向下取整
          transform.width -= (transform.width % gridX);
        } else {
          // 宽度变小时向上取整
          transform.width -= ((transform.width % gridX) - gridX);
        }
      }

      // 原理同上
      if (transform.height % gridY > 0) {
        if (transform.height > this.localeTransform.height) {
          transform.height -= (transform.height % gridY);
        } else {
          transform.height -= ((transform.height % gridY) - gridY);
        }
      }
      // 限制在父元素中
      transform.height = this.restrictHeight(transform.height, resizeType);
      transform.width = this.restrictWidth(transform.width, resizeType);

      // 根据新的旋转和宽高计算新的位置
      const matrix = getPoints(transform, this.zoom);
      const newOpposite = matrix[pointMap[type]];
      const deltaX = -(newOpposite.x - opposite.x) / this.zoom;
      const deltaY = -(newOpposite.y - opposite.y) / this.zoom;
      transform.x = Math.round(transform.x + deltaX);
      transform.y = Math.round(transform.y + deltaY);
      this.transform = transform;
    },

    handleRotateStart(event) {
      const { clientX, clientY } = event.touches ? event.touches[0] : event;
      const t = this.$refs.wrapper.getBoundingClientRect();
      // eslint-disable-next-line no-mixed-operators
      const cx = t.left + t.width / 2;
      // eslint-disable-next-line no-mixed-operators
      const cy = t.top + t.height / 2;
      const startAngle = (180 / Math.PI) * Math.atan2(clientY - cy, clientX - cx);
      const rotation = this.transform.rotation;
      // 记录旋转的角度和组件的中心点
      // eslint-disable-next-line no-underscore-dangle
      this._rotateOpt = { cx, cy, startAngle, rotation };
    },
    handleRotateMove(event) {
      // eslint-disable-next-line no-underscore-dangle
      const { cx, cy, startAngle, rotation } = this._rotateOpt;
      const { clientX, clientY } = event.touches ? event.touches[0] : event;
      const x = clientX - cx;
      const y = clientY - cy;
      const angle = (180 / Math.PI) * Math.atan2(y, x);
      // 旋转角度 = 鼠标移动时角度 - 鼠标按下时角度
      // 旋转后的角度 = 组件按下时角度 + 旋转角度
      const currentAngle = angle - startAngle;
      let r = rotation + currentAngle;
      r %= 360;
      r = r < 0 ? r + 360 : r;
      this.transform.rotation = Math.floor(r);
    },
    getClassNames() {
      const ddrClassNames = ['yoyoo-ddr'];

      if (this.active) ddrClassNames.push('active');
      if (this.isDragging) ddrClassNames.push('ddr-dragging');
      if (this.isResizing) ddrClassNames.push('ddr-resizing');
      if (this.isRotating) ddrClassNames.push('ddr-rotating');
      if (this.isReadyToDrag) ddrClassNames.push('ddr-ready-drag');
      if (this.isReadyToResize) ddrClassNames.push('ddr-ready-resize');
      if (this.isReadyToRotate) ddrClassNames.push('ddr-ready-rotate');
      return ddrClassNames;
    },
  },
  render() {
    return (
      <div
        ref="wrapper"
        style={this.style}
        class={this.getClassNames()}
        onTouchstart={this.handleMouseDown}
        onMousedown={this.handleMouseDown}
      >
        {this.renderContent ? this.renderContent(this) : this.$slots.default}
        {this.resizable && (
          <div class="resize-handler-wrapper">
            {this.resizeHandler.map(item => (
              <span
                data-resizetype={item}
                key={item}
                style={this.getNewHandler(item)}
                class={`resize-handler ${item}`}
              />
            ))}
          </div>
        )}
        {this.rotatable &&
        <span style={this.rotateHandler} data-type="rotate" class="rotate-handler"/>}
      </div>
    );
  },
};
</script>

<style lang="less">
.yoyoo-ddr {
  position: absolute;

  .resize-handler.tm {
    left: 50%;
  }

  .resize-handler.r {
    top: 50%;
  }

  .resize-handler.bm {
    left: 50%;
  }

  .resize-handler.l {
    top: 50%;
    cursor: pointer;
  }

  .resize-handler,
  .rotate-handler {
    display: none;
    position: absolute;
    border: 1px solid #607d8b;
    background: #fff;
    box-sizing: border-box;
    border-radius: 50%;
  }

  .rotate-handler {
    left: 50%;
    cursor: crosshair;
  }

  &.active {
    border: 1px dashed #607d8b;

    > .resize-handler-wrapper > .resize-handler,
    > .rotate-handler {
      display: inline-block;
    }
  }

  .br,
  .tr,
  .tl,
  .bl {
    background: #607d8b;
  }
}
</style>
