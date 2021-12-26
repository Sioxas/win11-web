import { useRef } from 'react';
import Button, {ButtonProps} from '../Button';

interface DropdownButtonProps extends Omit<ButtonProps, 'ref'> {

}

function DropdownButton ({ ...rest }: DropdownButtonProps){

  const ref = useRef<HTMLButtonElement>(null);

  return <Button ref={ref} {...rest} />
}