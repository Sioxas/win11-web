import { useRef } from 'react';

import { ContextMenuItem } from '@/core/ContextMenu';
import Button, { ButtonProps } from '../Button';
import { useContextMenuService } from '@/core/ServiceHooks';

import './style.less';

interface DropdownButtonProps extends Omit<ButtonProps, 'ref'> {
  menus: ContextMenuItem[];
}

function DropdownButton({ menus, ...rest }: DropdownButtonProps) {

  const ref = useRef<HTMLButtonElement>(null);

  const contextMenu = useContextMenuService();

  function onClick() {
    contextMenu.dropdown(ref, menus);
  }

  return <Button ref={ref} onClick={onClick} {...rest} />
}

export default {
  Button: DropdownButton
}
