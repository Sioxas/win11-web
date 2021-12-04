import TextField from '@/components/TextField';

import './style.less';

export default function StartMenuView() {
  return (
    <div className="start-menu"> 
      <TextField placeholder='在此键入以搜索' size='large' />
    </div>
  );
}