import start from '@/assets/icons/start.png';
import search from '@/assets/icons/search-dark.png';
import widget from '@/assets/icons/widget.png';
import settings from '@/assets/icons/settings.png';
import explorer from '@/assets/icons/explorer.png';
import edge from '@/assets/icons/edge.png';
import store from '@/assets/icons/store-light.png';
import vscode from '@/assets/icons/vscode.png';

import './TaskBar.less';

const apps = [
  { name: 'start', icon: start, },
  { name: 'search', icon: search, },
  { name: 'widget', icon: widget, },
  { name: 'settings', icon: settings,  },
  { name: 'explorer', icon: explorer,  },
  { name: 'edge', icon: edge,  },
  { name: 'store', icon: store, },
  { name: 'vscode', icon: vscode, },
];

export default function TaskBar() {
  return <div className="task-bar">
    {apps.map(({name,icon})=><button key={name} className="task-bar-app-btn">
      <img width="22" src={icon} alt={name} />
    </button>)}
  </div>
}