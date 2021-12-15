import TextRuler from "@/utils/TextRuler";
import ContextMenuService from "./ContextMenuService";
import { ContextMenuItem, ContextMenuType } from "./interface";

const MENU_SEPARATOR_HEIGHT = 17;
const MENU_ITEM_HEIGHT = 32;
const MENU_TEXT_PADDING = 8 * 2;
const MENU_BORDER_WIDTH = 1;
const MENU_MIN_WIDTH = 120;
const MENU_PANEL_PADDING = 4;
const MENU_ICON_SIZE = 16;
const MENU_CHECKBOX_SIZE = 14;
const MORE_ICON_SIZE = 16;

export default class MenuPanelController {
  private static textRuler = new TextRuler('14px normal Inter, sans-serif');

  public x: number;

  public y: number;

  public width: number;

  public height: number;
  public hasCheckbox = false;
  public hasIcon = false;

  private contextMenuSerivce = ContextMenuService.getInstance();

  constructor(x: number, y: number, public options: ContextMenuItem[], parent?: MenuPanelController) {
    for (const option of options) {
      if (option.type !== ContextMenuType.Menu)
        continue;
      if (option.checked)
        this.hasCheckbox = true;
      if (option.icon)
        this.hasIcon = true;
      if (this.hasCheckbox && this.hasIcon)
        break;
    }
    const width = this.width = this.getMenuWidth(options);
    const height = this.height = this.getMenuHeight(options);
    if (parent) y -= MENU_PANEL_PADDING;
    this.y = Math.min(y, window.innerHeight - height);
    if(parent) x -= MENU_PANEL_PADDING;
    if(x > window.innerWidth - width){
      this.x = x - width;
      if(parent) {
        this.x = this.x - parent.width + MENU_PANEL_PADDING * 2;
      } 
    }else{
      this.x = x;
    }
  }

  private getMenuWidth(options: ContextMenuItem[]) {
    const longestTextWidth = options
      .map(option => {
        let itemWidth = MenuPanelController.textRuler.measureText(option.text);
        if(option.children && option.children.length > 0) itemWidth += MORE_ICON_SIZE;
        return itemWidth;
      })
      .reduce((a, b) => a > b ? a : b);
    let menuWidth = longestTextWidth + MENU_TEXT_PADDING + MENU_PANEL_PADDING * 2 + MENU_BORDER_WIDTH * 2;
    if (this.hasCheckbox) menuWidth += MENU_CHECKBOX_SIZE + MENU_PANEL_PADDING;
    if (this.hasIcon) menuWidth += MENU_ICON_SIZE + MENU_PANEL_PADDING;
    return Math.max(menuWidth, MENU_MIN_WIDTH);
  }

  private getMenuHeight(options: ContextMenuItem[]) {
    const itemsHeight = options
      .map(option => option.type === ContextMenuType.Separator ? MENU_SEPARATOR_HEIGHT : MENU_ITEM_HEIGHT)
      .reduce((a, b) => a + b, 0);
    return itemsHeight + MENU_PANEL_PADDING * 2 + MENU_BORDER_WIDTH * 2;
  }

  #p0 = [0, 0];
  #v1 = [0, 0];
  #v2 = [0, 0];

  onPointerEnter(event: React.PointerEvent<HTMLLIElement>, path: ContextMenuItem[]) {
    if (!path.length) return;
    let panels = this.contextMenuSerivce.panels;
    if (panels.length > path.length) {
      // judge whether the mouse point p is between A and C.
      // more detail: https://stackoverflow.com/questions/13640931/how-to-determine-if-a-vector-is-between-two-other-vectors
      const p = [event.clientX, event.clientY],
        A = this.#v1, C = this.#v2,
        B = [p[0] - this.#p0[0], p[1] - this.#p0[1]],
        // cross product of A and B
        AxB = A[0] * B[1] - A[1] * B[0],
        AxC = A[0] * C[1] - A[1] * C[0],
        CxB = C[0] * B[1] - C[1] * B[0],
        CxA = C[0] * A[1] - C[1] * A[0];
      if (AxB * AxC >= 0 && CxB * CxA >= 0) {
        // B is inside of A and C
        return;
      }
      panels = panels.slice(0, path.length);
    }
    const last = path[path.length - 1];
    if (last.children && last.children.length > 0) {
      // find element parent which has context-menu-item class
      const element = (event.target as HTMLElement).closest('.context-menu-item');
      if (element) {
        const rect = (element as HTMLElement).getBoundingClientRect();
        const panel = new MenuPanelController(rect.right + MENU_PANEL_PADDING, rect.top, last.children, panels[panels.length - 1]);
        panels = [...panels, panel];
        this.contextMenuSerivce.path = path;
        // compute the intercection point of p1p2 and p3p4
        // more detail: https://www.cuemath.com/geometry/intersection-of-two-lines/
        const { x, y } = panel,
          p1 = [event.clientX, rect.top], p2 = [x, y],
          p3 = [event.clientX, rect.bottom], p4 = [x, y + panel.height],
          a1 = p2[1] - p1[1], b1 = p1[0] - p2[0], c1 = p2[0] * p1[1] - p1[0] * p2[1],
          a2 = p4[1] - p3[1], b2 = p3[0] - p4[0], c2 = p4[0] * p3[1] - p3[0] * p4[1],
          x0 = (b1 * c2 - b2 * c1) / (a1 * b2 - a2 * b1),
          y0 = (a2 * c1 - a1 * c2) / (a1 * b2 - a2 * b1);
        this.#p0 = [x0, y0]; // intersection point
        this.#v1 = [p2[0] - x0, p2[1] - y0];
        this.#v2 = [p4[0] - x0, p4[1] - y0];
      }
    }
    if (panels !== this.contextMenuSerivce.panels)
      this.contextMenuSerivce.panels = panels;
  }

  onSelect(path: ContextMenuItem[]) {
    if (!path.length) return;
    const last = path[path.length - 1];
    last.onSelect?.(path);
    // close();
  }
}