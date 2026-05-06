export interface DatasheetItem {
  id: string;
  name: string;
  category: string;
  series: string;
  viewUrl: string;
  downloadUrl: string;
}

export const DATASHEETS: DatasheetItem[] = [
  // 1-4: DTC Series
  {
    id: 'ai-5x41',
    name: 'AI-5X41 (AI-5441, AI-5741, AI-5841, AI-5941)',
    category: 'Temperature Controller',
    series: 'DTC Series',
    viewUrl: 'https://backend.itherm.co.in/ds-ai-5x41/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-AI-5X41.pdf'
  },
  {
    id: 'ai-5x81',
    name: 'AI-5X81 (AI-5981)',
    category: 'Temperature Controller',
    series: 'DTC Series',
    viewUrl: 'https://backend.itherm.co.in/ds-ai-5x81/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-AI-5X81.pdf'
  },
  {
    id: 'ai-5x42',
    name: 'AI-5X42 (AI-5442, AI-5742, AI-5942)',
    category: 'Temperature Controller',
    series: 'DTC Series',
    viewUrl: 'https://backend.itherm.co.in/ds-ai-5x42/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-AI-5X42.pdf'
  },
  {
    id: 'ai-5x82',
    name: 'AI-5X82 (AI-5982)',
    category: 'Temperature Controller',
    series: 'DTC Series',
    viewUrl: 'https://backend.itherm.co.in/ds-ai-5x82/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-AI-5X82.pdf'
  },

  // 5-7: AI-7 Series
  {
    id: 'ai-7x41',
    name: 'AI-7X41 (AI-7441, AI-7741, AI-7841, AI-7941)',
    category: 'Temperature Controller',
    series: 'AI-7 Series',
    viewUrl: 'https://backend.itherm.co.in/ds-ai-7x41/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-AI-7X41.pdf'
  },
  {
    id: 'ai-7x82',
    name: 'AI-7X82 (AI-7482, AI-7682, AI-7782, AI-7882, AI-7982)',
    category: 'Temperature Controller',
    series: 'AI-7 Series',
    viewUrl: 'https://backend.itherm.co.in/ds-ai-7x82/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-AI-7X82.pdf'
  },
  {
    id: 'ai-7x81',
    name: 'AI-7X81 (AI-7481, AI-7681, AI-7781, AI-7881, AI-7981)',
    category: 'Temperature Controller',
    series: 'AI-7 Series',
    viewUrl: 'https://backend.itherm.co.in/ds-ai-7x81/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-AI-7X81.pdf'
  },

  // 8-12: Px Series
  {
    id: 'px-x13',
    name: 'Px-X13 (Px-413, Px-713)',
    category: 'Temperature Controller',
    series: 'Px Series',
    viewUrl: 'https://backend.itherm.co.in/ds-px-x13/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-Px-X13.pdf'
  },
  {
    id: 'px-x14',
    name: 'Px-X14 (Px-414, Px-714)',
    category: 'Temperature Controller',
    series: 'Px Series',
    viewUrl: 'https://backend.itherm.co.in/ds-px-x14/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-Px-X14.pdf'
  },
  {
    id: 'px-x18e',
    name: 'Px-X18e (Px-418e, Px-718e)',
    category: 'Temperature Controller',
    series: 'Px Series',
    viewUrl: 'https://backend.itherm.co.in/ds-px-x18e/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-Px-X18e.pdf'
  },
  {
    id: 'px-x18',
    name: 'Px-X18 (Px-418, Px-718)',
    category: 'Temperature Controller',
    series: 'Px Series',
    viewUrl: 'https://backend.itherm.co.in/ds-px-x18/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-Px-X18.pdf'
  },
  {
    id: 'px-x28',
    name: 'Px-X28 (Px-428, Px-728)',
    category: 'Temperature Controller',
    series: 'Px Series',
    viewUrl: 'https://backend.itherm.co.in/ds-px-x28/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-Px-X28.pdf'
  },

  // 13: Process Controller
  {
    id: 'fx-x38',
    name: 'Fx-X38 (Fx-438, Fx-738)',
    category: 'Process Controller',
    series: 'Fx Series',
    viewUrl: 'https://backend.itherm.co.in/ds-fx-x38/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-Fx-X38.pdf'
  },

  // 14-17: Process Indicator PI Series
  {
    id: 'pi-xx',
    name: 'PI-XX (PI-44, PI-77, PI-88, PI-99)',
    category: 'Process Indicator',
    series: 'PI Series',
    viewUrl: 'https://backend.itherm.co.in/ds-pi-xx/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-PI-XX.pdf'
  },
  {
    id: 'pi-xx2',
    name: 'PI-XX2 (PI-442, PI-772, PI-882, PI-992)',
    category: 'Process Indicator',
    series: 'PI Series',
    viewUrl: 'https://backend.itherm.co.in/ds-pi-xx2/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-PI-XX2.pdf'
  },
  {
    id: 'pi-xxu',
    name: 'PI-XXU (PI-44U, PI-77U, PI-88U, PI-99U)',
    category: 'Process Indicator',
    series: 'PI Series',
    viewUrl: 'https://backend.itherm.co.in/ds-pi-xxu/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-PI-XXU.pdf'
  },
  {
    id: 'pi-xxx',
    name: 'PI-XXX (PI-44X, PI-77X, PI-88X, PI-99X)',
    category: 'Process Indicator',
    series: 'PI Series',
    viewUrl: 'https://backend.itherm.co.in/ds-pi-xxx/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-PI-XXX.pdf'
  },

  // 18-20: Process Indicator PI-JD Series
  {
    id: 'pi-jd',
    name: 'PI-JD (PI-JD-2, PI-JD-4)',
    category: 'Process Indicator',
    series: 'PI-JD Series',
    viewUrl: 'https://backend.itherm.co.in/ds-pi-jd/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-PI-JD.pdf'
  },
  {
    id: 'ktc-jd',
    name: 'KTC-JD (KTC-JD-2, KTC-JD-4)',
    category: 'Process Indicator',
    series: 'PI-JD Series',
    viewUrl: 'https://backend.itherm.co.in/ds-ktc-jd-x/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-KTC-JD.pdf'
  },
  {
    id: 'ctr-jd',
    name: 'CTR-JD (CTR-JD-2, CTR-JD-4)',
    category: 'Process Indicator',
    series: 'PI-JD Series',
    viewUrl: 'https://backend.itherm.co.in/ds-ctr-jd-x/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-CTR-JD.pdf'
  },

  // 21: Counters BL Series
  {
    id: 'bl-xx',
    name: 'BL-XX (BL-44, BL-77, BL-88, BL-99)',
    category: 'Counters',
    series: 'BL Series',
    viewUrl: 'https://backend.itherm.co.in/ds-bl-xx/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-BL-XX.pdf'
  },

  // 22-25: Multifunction Timers & Counters
  {
    id: 'ctr-xx',
    name: 'CTR-XX (CTR-33, CTR-44, CTR-77, CTR-88, CTR-99)',
    category: 'Multifunction Timers & Counters',
    series: 'CTR Series',
    viewUrl: 'https://backend.itherm.co.in/ds-ctr-xx/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-CTR-XX.pdf'
  },
  {
    id: 'cx-408-428',
    name: 'Cx-408 / Cx-428',
    category: 'Multifunction Timers & Counters',
    series: 'Cx Series',
    viewUrl: 'https://backend.itherm.co.in/ds-cx-408/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-Cx-408.pdf'
  },
  {
    id: 'cx-x28',
    name: 'Cx-X28 (Cx-728, Cx-928)',
    category: 'Multifunction Timers & Counters',
    series: 'Cx Series',
    viewUrl: 'https://backend.itherm.co.in/ds-cx-x28/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-Cx-X28.pdf'
  },
  {
    id: 'xtc-xx4',
    name: 'XTC-XX4 (XTC-774, XTC-994)',
    category: 'Multifunction Timers & Counters',
    series: 'XTC Series',
    viewUrl: 'https://backend.itherm.co.in/ds-xtc-xx4/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-XTC-XX4.pdf'
  },

  // 26-28: Timers KTM Series
  {
    id: 'ktm-xx3',
    name: 'KTM-XX3 (KTM-443, KTM-773, KTM-993)',
    category: 'Timers',
    series: 'KTM Series',
    viewUrl: 'https://backend.itherm.co.in/ds-ktm-xx3/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-KTM-XX3.pdf'
  },
  {
    id: 'ktm-xx6',
    name: 'KTM-XX6 (KTM-776, KTM-996)',
    category: 'Timers',
    series: 'KTM Series',
    viewUrl: 'https://backend.itherm.co.in/ds-ktm-xx6/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-KTM-XX6.pdf'
  },
  {
    id: 'ktm-448',
    name: 'KTM-448',
    category: 'Timers',
    series: 'KTM Series',
    viewUrl: 'https://backend.itherm.co.in/ds-ktm-xx8/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-KTM-448.pdf'
  },

  // 29: Timers XTM Series
  {
    id: 'xtm-xx3',
    name: 'XTM-XX3 (XTM-443, XTM-773, XTM-993)',
    category: 'Timers',
    series: 'XTM Series',
    viewUrl: 'https://backend.itherm.co.in/ds-xtm-xx3/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-XTM-XX3.pdf'
  },

  // 30-31: Humidity Controller
  {
    id: 'humi-temp',
    name: 'HUMI-TEMP',
    category: 'Application Specific',
    series: 'Humidity Controller',
    viewUrl: 'https://backend.itherm.co.in/ds-humi-temp/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-HUMI-TEMP.pdf'
  },
  {
    id: 'rhtc-400',
    name: 'RHTC-400',
    category: 'Application Specific',
    series: 'Humidity Controller',
    viewUrl: 'https://backend.itherm.co.in/ds-rhtc-400/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-RHTC-400.pdf'
  },

  // 32-35: Auto Clave Controller
  {
    id: 'va-clave',
    name: 'VA-CLAVE',
    category: 'Application Specific',
    series: 'Auto Clave Controller',
    viewUrl: 'https://backend.itherm.co.in/ds-va-clave/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-VA-CLAVE.pdf'
  },
  {
    id: 'vac-44',
    name: 'VAC-44',
    category: 'Application Specific',
    series: 'Auto Clave Controller',
    viewUrl: 'https://backend.itherm.co.in/ds-vac-44/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-VAC-44.pdf'
  },
  {
    id: 'faac',
    name: 'FAAC',
    category: 'Application Specific',
    series: 'Auto Clave Controller',
    viewUrl: 'https://backend.itherm.co.in/ds-faac/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-FAAC.pdf'
  },
  {
    id: 'faac-plus',
    name: 'FAAC+',
    category: 'Application Specific',
    series: 'Auto Clave Controller',
    viewUrl: 'https://backend.itherm.co.in/ds-faac-plus-e/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-FAAC-Plus.pdf'
  },

  // 36: ULT Controller
  {
    id: 'ult-99',
    name: 'ULT-99',
    category: 'Application Specific',
    series: 'ULT Controller',
    viewUrl: 'https://backend.itherm.co.in/ds-ult-99/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-ULT-99.pdf'
  },

  // 37-41: Data-LOGGER
  {
    id: 'ai-logger',
    name: 'AI-Logger',
    category: 'Application Specific',
    series: 'Data-LOGGER',
    viewUrl: 'https://backend.itherm.co.in/ds-ai-logger/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-AI-Logger.pdf'
  },
  {
    id: 'ai-usb-logger',
    name: 'AI-USB Logger',
    category: 'Application Specific',
    series: 'Data-LOGGER',
    viewUrl: 'https://backend.itherm.co.in/ds-ai-usb-logger/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-AI-USB-Logger.pdf'
  },
  {
    id: 'ai-logger-print',
    name: 'AI-Logger Print Out',
    category: 'Application Specific',
    series: 'Data-LOGGER',
    viewUrl: 'https://backend.itherm.co.in/ai-logger-printout/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-AI-Logger-PrintOut.pdf'
  },
  {
    id: 'va-logger',
    name: 'VA-Logger',
    category: 'Application Specific',
    series: 'Data-LOGGER',
    viewUrl: 'https://backend.itherm.co.in/ds-va-logger/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-VA-Logger.pdf'
  },
  {
    id: 'va-logger-print',
    name: 'VA-Logger Print Out',
    category: 'Application Specific',
    series: 'Data-LOGGER',
    viewUrl: 'https://backend.itherm.co.in/va-logger-printout/',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/DS-VA-Logger-PrintOut.pdf'
  }
];
