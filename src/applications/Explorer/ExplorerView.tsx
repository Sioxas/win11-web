import Button from '@/components/Button';
import { ColoredIcon, ColoredIconGlyph } from '@/components/ColoredIcon';
import Dropdown from '@/components/Dropdown';
import { newMenu } from './config';

import './style.less';

export default function ExplorerView() {
  return (
    <div className="explorer">
      <div className="explorer-toolbar">
        <Dropdown.Button type='text' style={{ padding:'0 8px' }} menus={newMenu}>
          <ColoredIcon glyph={ColoredIconGlyph.New} style={{ fontSize:'18px', margin:'0 5px' }} />
          <span>新建</span>
          <i className='iconfont icon-down' style={{ fontSize:'12px', margin: '0 3px' }} />
        </Dropdown.Button>
        <div className="explorer-toolbar-divider"></div>
        <Button type='text' style={{ padding:'0 8px' }}>
          <ColoredIcon glyph={ColoredIconGlyph.Cut} style={{ fontSize:'18px', margin:'0 5px' }} />
        </Button>
        <Button type='text' style={{ padding:'0 8px' }}>
          <ColoredIcon glyph={ColoredIconGlyph.Copy} style={{ fontSize:'18px', margin:'0 5px' }} />
        </Button>
        <Button type='text' style={{ padding:'0 8px' }}>
          <ColoredIcon glyph={ColoredIconGlyph.CopyLocation} style={{ fontSize:'18px', margin:'0 5px' }} />
        </Button>
        <Button type='text' style={{ padding:'0 8px' }}>
          <ColoredIcon glyph={ColoredIconGlyph.Paste} style={{ fontSize:'18px', margin:'0 5px' }} />
        </Button>
        <Button type='text' style={{ padding:'0 8px' }}>
          <ColoredIcon glyph={ColoredIconGlyph.Rename} style={{ fontSize:'18px', margin:'0 5px' }} />
        </Button>
        <Button type='text' style={{ padding:'0 8px' }}>
          <ColoredIcon glyph={ColoredIconGlyph.Share} style={{ fontSize:'18px', margin:'0 5px' }} />
        </Button>
        <Button type='text' style={{ padding:'0 8px' }}>
          <ColoredIcon glyph={ColoredIconGlyph.Delete} style={{ fontSize:'18px', margin:'0 5px' }} />
        </Button>
        <div className="explorer-toolbar-divider"></div>
        <Button type='text' style={{ padding:'0 8px' }}>
          <ColoredIcon glyph={ColoredIconGlyph.SortBy} style={{ fontSize:'18px', margin:'0 5px' }} />
          <span>排序</span>
          <i className='iconfont icon-down' style={{ fontSize:'12px', margin: '0 3px' }} />
        </Button>
        <Button type='text' style={{ padding:'0 8px' }}>
          <ColoredIcon glyph={ColoredIconGlyph.Properties} style={{ fontSize:'18px', margin:'0 5px' }} />
        </Button>
      </div>
    </div>
  );
}
