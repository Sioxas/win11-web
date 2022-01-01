import { useRef } from 'react';

import { ConnectionPositionPair } from '@/core/Overlay/PositioinStrategy';
import { useOverlay } from '@/core/ServiceHooks';
import Button, {ButtonProps} from '../Button';

import './style.less';

interface DropdownButtonProps extends Omit<ButtonProps, 'ref'> {

}

function DropdownButton ({ ...rest }: DropdownButtonProps){

  const ref = useRef<HTMLButtonElement>(null);

  const overlay = useOverlay();

  function onClick(){
    const positionStrategy = overlay.position()
      .flexibleConnectedTo(ref.current!)
      .withPositions([
        new ConnectionPositionPair({ originX: 'start', originY: 'bottom' }, { overlayX: 'start', overlayY: 'top' }),
        new ConnectionPositionPair({ originX: 'end', originY: 'bottom' }, { overlayX: 'end', overlayY: 'top' }),
        new ConnectionPositionPair({ originX: 'start', originY: 'top' }, { overlayX: 'start', overlayY: 'bottom' }),
        new ConnectionPositionPair({ originX: 'end', originY: 'top' }, { overlayX: 'end', overlayY: 'bottom' }),
      ])
      .withHorizontalFlexible();
    const dropdown = overlay.create({ positionStrategy, hasBackdrop: true, panelClass: 'dropdown-panel' });
    dropdown.attach(<div>Hello 哈哈哈哈哈 新年快乐 啦啦啦啦啦啦啦啦</div>);
    dropdown.backdropClick$.subscribe(() => dropdown.detach());
  }

  return <Button ref={ref} onClick={onClick} {...rest} />
}

export default {
  Button: DropdownButton
}