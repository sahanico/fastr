import { deepCopyComponent } from '../../utils';
import { EVENT_COMPONENT_DELETE, EVENT_COMPONENT_DUPLICATE } from '../event-enums';

// eslint-disable-next-line import/prefer-default-export
export function registerSelectionActions(selection) {
  selection.eventbus.$on(EVENT_COMPONENT_DELETE, () => {
    if (selection.componentRefs.length > 1) {
      selection.application.batchDeleteControls(selection.componentRefs.map(item => item.id));
      // eslint-disable-next-line no-param-reassign
      selection.selectionActive = false;
    }
  });

  selection.eventbus.$on(EVENT_COMPONENT_DUPLICATE, () => {
    if (selection.componentRefs.length > 1) {
      const components = [];
      const transformList = [];
      const newComponent = (item) => {
        const copyOfSelected = deepCopyComponent(item);
        const t = copyOfSelected.transform;
        copyOfSelected.transform = {
          x: t.x,
          y: t.y + selection.selectionTransform.height,
          width: t.width,
          height: t.height,
          rotation: t.rotation,
        };
        // eslint-disable-next-line no-use-before-define
        ids.push(copyOfSelected.id);

        transformList.push({
          id: copyOfSelected.id,
          ...copyOfSelected.transform,
        });
        return copyOfSelected;
      };
      let ids = [];
      selection.application.controls.forEach((item) => {
        const component = selection.componentRefs.find(ref => item.id === ref.id);
        if (component) {
          components.push(newComponent(item));
        }
      });
      // eslint-disable-next-line no-param-reassign
      selection.application.controls = selection.application.controls.concat(components);
      // eslint-disable-next-line no-param-reassign
      selection.selectedComponents = transformList;
      // eslint-disable-next-line no-param-reassign
      selection.selectionTransform = {
        ...selection.selectionTransform,
        y: selection.selectionTransform.y + selection.selectionTransform.height,
      };
      // 渲染后重新获取ref
      selection.$nextTick(() => {
        selection.getSelectedComponentRefs(ids, selection.selectionTransform);
      });
    }
  });

  document.addEventListener('mousedown', (e) => {
    if (e.target.dataset.action === 'duplicate') {
      return;
    }
    // eslint-disable-next-line no-param-reassign
    selection.selectionActive = false;
  });
}
