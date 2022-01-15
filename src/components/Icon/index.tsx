import classNames from 'classnames';

import './style.less';

export class ColoredIconGlyph {
  static readonly New = new ColoredIconGlyph("\uF037", "\uF038");
  static readonly Copy = new ColoredIconGlyph("\uF021", "\uF022");
  static readonly CopyLocation = new ColoredIconGlyph("\uF02F", "\uF030");
  static readonly Paste = new ColoredIconGlyph("\uF023", "\uF024");
  static readonly Cut = new ColoredIconGlyph("\uF03D", "\uF03E");
  static readonly Rename = new ColoredIconGlyph("\uF027", "\uF028");
  static readonly Share = new ColoredIconGlyph("\uF025", "\uF026");
  static readonly Delete = new ColoredIconGlyph("\uF035", "\uF036");
  static readonly SortBy = new ColoredIconGlyph("\uF029", "\uF02A");
  static readonly Properties = new ColoredIconGlyph("\uF031", "\uF032");
  static readonly PropertiesFolder = new ColoredIconGlyph("\uF031", "\uF032");
  static readonly CreateFolder = new ColoredIconGlyph("\uF033", "\uF034");
  constructor(
    public baseLayerGlyph: string, 
    public overlayLayerGlyph?: string
  ) { }
}

interface ColoredIconProps {
  glyph: ColoredIconGlyph;
  className?: string;
  style?: React.CSSProperties;
}

export function ColoredIcon({ glyph, className = '', style }: ColoredIconProps) {
  return <div className={`colored-icon ${className}`} style={style}>
    <div className="colored-icon-base-layer">{glyph.baseLayerGlyph}</div>
    {glyph.overlayLayerGlyph && <div className="colored-icon-overlay-layer">{glyph.overlayLayerGlyph}</div>}
  </div>;
}

interface IconProps{
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Icon({ name, className, style }: IconProps){
  return <i className={classNames('iconfont', `icon-${name}`, className)} style={style} />;
}
