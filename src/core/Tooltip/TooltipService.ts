import Service from "@/utils/Service";
import Overlay from "../Overlay/Overlay";

import './style.less';

export default class TooltipService extends Service {
  constructor(private overlay: Overlay) {
    super();
    let moving = false; // 鼠标是否在移动
    let hoverTimer: number;
    // let vanishTimer: number;
    const positionStrategy = this.overlay.position().flexibleConnectedTo({ x: 0, y: 0 });
    const tooltip = overlay.create({
      positionStrategy,
      panelClass: 'overlay-panel global-tooltip',
    });

    function onPointerIdle(event: PointerEvent, path: HTMLElement[]) {
      moving = false;
      // 路径元素上的 title 都更换为 tip，阻止浏览器的默认行为
      for (const element of path) {
        if (element.hasAttribute?.('title')) {
          const content = element.getAttribute('title');
          if (content) {
            element.setAttribute('tip', content);
          }
          element.removeAttribute('title');
        }
      }
      // 找到第一个有 tip 属性的元素
      const element = path.find(el => el.hasAttribute?.('tip'));
      const content = element?.getAttribute('tip');
      if (content) {
        tooltip.attach(content);
        tooltip.updatePosition({
          x: event.clientX + 5,
          y: event.clientY + 15,
        });
        // clearTimeout(vanishTimer); // 阻止消失
      }
    }

    function onPointerMove(event: PointerEvent) {
      if (!moving && tooltip.attached) {
        tooltip.detach();
      }
      moving = true;
      clearTimeout(hoverTimer);
      // https://stackoverflow.com/questions/62181537/why-does-composedpath-on-event-returns-different-value-when-delayed
      const path = event.composedPath();
      // 最后一个 onPointerMove 触发 300ms 后，触发 onPointerIdle
      hoverTimer = setTimeout(onPointerIdle, 300, event, path);
    }


    document.addEventListener("pointermove", onPointerMove);
  }
}