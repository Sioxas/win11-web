import Button from '@/components/Button';
import { ColoredIcon, ColoredIconGlyph, Icon } from '@/components/Icon';
import Dropdown from '@/components/Dropdown';
import Layout from '@/components/Layout';
import { newMenu } from './config';

export default function Toolbar() {
  return <Layout horizontal align="center" className="explorer-toolbar">
    <Dropdown.Button type='text' className='explorer-toolbar-item' menus={newMenu}>
      <ColoredIcon glyph={ColoredIconGlyph.New} className='explorer-toolbar-item-icon' />
      <span>新建</span>
      <Icon name='down' style={{ fontSize: '12px', margin: '0 3px' }} />
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
      <Icon name='down' style={{ fontSize: '12px', margin: '0 3px' }} />
    </Button>
    <Button type='text' className='explorer-toolbar-item'>
      <ColoredIcon glyph={ColoredIconGlyph.Properties} className='explorer-toolbar-item-icon' />
    </Button>
  </Layout>
}
