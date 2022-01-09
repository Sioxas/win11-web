import Button from '@/components/Button';
import { ColoredIcon, ColoredIconGlyph } from '@/components/ColoredIcon';
import Dropdown from '@/components/Dropdown';
import { newMenu } from './config';

import './style.less';

export default function ExplorerView() {
  return (
    <div className="explorer">
      <div className="explorer-toolbar">
        <Dropdown.Button type='text' className='explorer-toolbar-item' menus={newMenu}>
          <ColoredIcon glyph={ColoredIconGlyph.New} className='explorer-toolbar-item-icon' />
          <span>新建</span>
          <i className='iconfont icon-down' style={{ fontSize:'12px', margin: '0 3px' }} />
        </Dropdown.Button>
        <div className="explorer-toolbar-divider" />
        <Button type='text' className='explorer-toolbar-item'>
          <ColoredIcon glyph={ColoredIconGlyph.Cut} className='explorer-toolbar-item-icon' />
        </Button>
        <Button type='text' className='explorer-toolbar-item'>
          <ColoredIcon glyph={ColoredIconGlyph.Copy} className='explorer-toolbar-item-icon' />
        </Button>
        <Button type='text' className='explorer-toolbar-item'>
          <ColoredIcon glyph={ColoredIconGlyph.CopyLocation} className='explorer-toolbar-item-icon' />
        </Button>
        <Button type='text' className='explorer-toolbar-item'>
          <ColoredIcon glyph={ColoredIconGlyph.Paste} className='explorer-toolbar-item-icon' />
        </Button>
        <Button type='text' className='explorer-toolbar-item'>
          <ColoredIcon glyph={ColoredIconGlyph.Rename} className='explorer-toolbar-item-icon' />
        </Button>
        <Button type='text' className='explorer-toolbar-item'>
          <ColoredIcon glyph={ColoredIconGlyph.Share} className='explorer-toolbar-item-icon' />
        </Button>
        <Button type='text' className='explorer-toolbar-item'>
          <ColoredIcon glyph={ColoredIconGlyph.Delete} className='explorer-toolbar-item-icon' />
        </Button>
        <div className="explorer-toolbar-divider"></div>
        <Button type='text' className='explorer-toolbar-item'>
          <ColoredIcon glyph={ColoredIconGlyph.SortBy} className='explorer-toolbar-item-icon' />
          <span>排序</span>
          <i className='iconfont icon-down' style={{ fontSize:'12px', margin: '0 3px' }} />
        </Button>
        <Button type='text' className='explorer-toolbar-item'>
          <ColoredIcon glyph={ColoredIconGlyph.Properties} className='explorer-toolbar-item-icon' />
        </Button>
      </div>
    </div>
  );
}
