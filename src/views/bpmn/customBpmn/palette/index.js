import customPalette from './CustomPalette'
import PaletteProvider from './CustomPaletteProvider'
import SpaceToolModule from 'diagram-js/lib/features/space-tool';
import LassoToolModule from 'diagram-js/lib/features/lasso-tool';
import HandToolModule from 'diagram-js/lib/features/hand-tool';
import GlobalConnectModule from 'diagram-js/lib/features/global-connect';
import translate from 'diagram-js/lib/i18n/translate';
// 该服务称为customPaletteProvider，它依赖于 customPalette，并且应在创建关系图时初始化该服务
export default {
  __depends__: [
    customPalette,
    SpaceToolModule,
    LassoToolModule,
    HandToolModule,
    GlobalConnectModule,
    translate
  ],
  __init__: ['customPaletteProvider'],
  customPaletteProvider: ['type', PaletteProvider]
}
