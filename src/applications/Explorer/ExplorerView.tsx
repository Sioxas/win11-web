import { useState } from 'react';

import Button from '@/components/Button';
import { ColoredIcon, ColoredIconGlyph } from '@/components/ColoredIcon';
import Dropdown from '@/components/Dropdown';
import { Select, Option } from '@/components/Select';
import { newMenu } from './config';

import './style.less';

export default function ExplorerView() {
  const [value, setValue] = useState<string|undefined>('1');
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
      <Select value={value} onChange={setValue} placeholder='Please select mode'>
        <Option value='1'>Mode 1</Option>
        <Option value='2'>Mode 2</Option>
        <Option value='3'>Mode 3</Option>
        <Option value='4'>Mode 4</Option>
        <Option value='5'>Mode 5</Option>
      </Select>
    </div>
  );
}
