import Button from '@/components/Button';
import TextField from '@/components/TextField';

import './style.less';

import start from '@/assets/icons/start.png';
import search from '@/assets/icons/search-dark.png';
import widget from '@/assets/icons/widget.png';
import settings from '@/assets/icons/settings.png';
import explorer from '@/assets/icons/explorer.png';
import edge from '@/assets/icons/edge.png';
import store from '@/assets/icons/store-light.png';
import vscode from '@/assets/icons/vscode.png';

const apps = [
  // { name: 'start', icon: start, },
  // { name: 'search', icon: search, },
  // { name: 'widget', icon: widget, },
  { name: 'Settings', icon: settings, },
  { name: 'Explorer', icon: explorer, },
  { name: 'Edge', icon: edge, },
  { name: 'Store', icon: store, },
  { name: 'VSCode', icon: vscode, },
];

export default function StartMenuView() {
  return (
    <div className="start-menu">
      <TextField placeholder='在此键入以搜索' size='large' prefix={
        <span className="iconfont icon-sousuo" />
      } />
      <div className="pinned-apps">
        <div className="pinned-apps-header">
          <div className="pinned-apps-header-title">
            已固定
          </div>
          <div className="pinned-apps-header-more">
            <Button size="mini">全部应用</Button>
          </div>
        </div>
        <div className="pinned-apps-content">
          {
            apps.map((app) => (
              <div className="pinned-apps-content-item">
                <div className="pinned-apps-content-item-icon">
                  <img src={app.icon} alt={app.name} />
                </div>
                <div className="pinned-apps-content-item-title">
                  {app.name}
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}