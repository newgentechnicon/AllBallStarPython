// in global.d.ts

import type { LoDashStatic } from 'lodash';
import type { JQueryStatic } from 'jquery';
import type * as noUiSlider from 'nouislider';
import type * as VanillaCalendarPro from 'vanilla-calendar-pro';
import type { IStaticMethods } from 'preline/dist';
import type Dropzone from 'dropzone';
import 'datatables.net';

declare global {
  interface Window {
    // Third-party libraries
    _: LoDashStatic;
    $: JQueryStatic;
    jQuery: JQueryStatic;
    DataTable: DataTables.Api; // Using 'any' is simplest, or use DataTables.Api from @types/datatables.net
    Dropzone: typeof Dropzone;
    noUiSlider: typeof noUiSlider;
    VanillaCalendarPro: typeof VanillaCalendarPro;

    // Preline UI
    HSStaticMethods: IStaticMethods;
  }
}

// This export statement is needed to make the file a module
export {};