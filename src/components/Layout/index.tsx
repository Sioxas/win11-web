import classNames from 'classnames';

import './style.less';

interface LayoutProps {
  vertical?: boolean;
  horizontal?: boolean;
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  fill?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export default function Layout({
  vertical = true,
  horizontal = false,
  justify = 'start',
  align = 'start',
  fill = false,
  className,
  style,
  children
}: LayoutProps) {
  const layoutStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: justify,
    alignItems: align,
  };
  if(vertical){
    layoutStyle.flexDirection = 'column';
  }
  if(horizontal){
    layoutStyle.flexDirection = 'row';
  }
  if (fill) {
    layoutStyle.flexGrow = 1;
  }
  if(style){
    Object.assign(layoutStyle, style);
  }
  return <div className={classNames('layout', className)} style={layoutStyle}>
    {children}
  </div>;
}