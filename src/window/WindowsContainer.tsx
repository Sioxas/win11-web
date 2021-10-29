import { useEffect, useState } from 'react';
import Window from './Window';
import WindowManagerProvider from './WindowManagerProvider';

import './WindowsContainer.less';

export default function WindowsContainer() {

  const [applications, setApplications] = useState<string[]>([]);

  useEffect(() => {
    setApplications(['vscode', 'chrome', 'firefox', 'slack']);
  }, []);

  return <WindowManagerProvider>
    {
      applications.map(application => <Window key={application} />)
    }
  </WindowManagerProvider>
}