import { useState } from 'react';

import Button from '@/components/Button';
import { ColoredIcon, ColoredIconGlyph } from '@/components/Icon';
import Dropdown from '@/components/Dropdown';
import { Select, Option } from '@/components/Select';
import Layout from '@/components/Layout';
import { newMenu } from './config';
import Toolbar from './Toolbar';
import AddressBar from './AddressBar';

import './style.less';

export default function ExplorerView() {
  return (
    <Layout vertical fill className="explorer">
      <Toolbar />
      <Layout vertical fill className="explorer-content">
        <AddressBar />
      </Layout>
    </Layout>
  );
}
