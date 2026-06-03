export interface OperatingManualItem {
  id: string;
  name: string;
  category: string;
  series: string;
  downloadUrl: string;
}

export const OPERATING_MANUALS: OperatingManualItem[] = [
  {
    id: 'ai-5x41',
    name: 'AI-5X41 (AI-5441, AI-5741, AI-5841, AI-5941)',
    category: 'Temperature Controller',
    series: 'DTC Series',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-AI-5X41.pdf'
  },
  {
    id: 'ai-5x42',
    name: 'AI-5X42 (AI-5442, AI-5742, AI-5942)',
    category: 'Temperature Controller',
    series: 'DTC Series',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-AI-5X42.pdf'
  },
  {
    id: 'ai-5x81',
    name: 'AI-5X81 (AI-5981)',
    category: 'Temperature Controller',
    series: 'DTC Series',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-AI-5X81.pdf'
  },
  {
    id: 'ai-5x82',
    name: 'AI-5X82 (AI-5982)',
    category: 'Temperature Controller',
    series: 'DTC Series',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-AI-5X82.pdf'
  },
  {
    id: 'ai-7x41',
    name: 'AI-7X41 (AI-7441, AI-7741, AI-7841, AI-7941)',
    category: 'Temperature Controller',
    series: 'AI-7 Series',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-AI-7X41.pdf'
  },
  {
    id: 'ai-7x81',
    name: 'AI-7X81 (AI-7481, AI-7681, AI-7781, AI-7881, AI-7981)',
    category: 'Temperature Controller',
    series: 'AI-7 Series',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-AI-7X81.pdf'
  },
  {
    id: 'px-x13',
    name: 'Px-X13 (Px-413, Px-713)',
    category: 'Temperature Controller',
    series: 'Px Series',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2023/02/OIM-Px-X13.pdf'
  },
  {
    id: 'px-x14',
    name: 'Px-X14 (Px-414, Px-714)',
    category: 'Temperature Controller',
    series: 'Px Series',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2023/02/OIM-Px-X14.pdf'
  },
  {
    id: 'px-x18e',
    name: 'Px-X18e (Px-418e, Px-718e)',
    category: 'Temperature Controller',
    series: 'Px Series',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2023/02/OIM-Px-X18e.pdf'
  },
  {
    id: 'px-x18',
    name: 'Px-X18 (Px-418, Px-718)',
    category: 'Temperature Controller',
    series: 'Px Series',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2023/02/OIM-Px-X18.pdf'
  },
  {
    id: 'px-x28',
    name: 'Px-X28 (Px-428, Px-728)',
    category: 'Temperature Controller',
    series: 'Px Series',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2023/02/OIM-Px-X28.pdf'
  },
  {
    id: 'fx-x38',
    name: 'Fx-X38 (Fx-438, Fx-738)',
    category: 'Process Controller',
    series: 'Fx Series',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-Fx-X38.pdf'
  },
  {
    id: 'pi-xx',
    name: 'PI-XX (PI-44, PI-77, PI-88, PI-99)',
    category: 'Process Indicators',
    series: 'PI Series',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-PI-XX.pdf'
  },
  {
    id: 'pi-xx2',
    name: 'PI-XX2 (PI-442, PI-772, PI-882, PI-992)',
    category: 'Process Indicators',
    series: 'PI Series',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-PI-XX2.pdf'
  },
  {
    id: 'pi-xxu',
    name: 'PI-XXU (PI-44U, PI-77U, PI-88U, PI-99U)',
    category: 'Process Indicators',
    series: 'PI Series',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-PI-XXU.pdf'
  },
  {
    id: 'pi-xxx',
    name: 'PI-XXX (PI-44X, PI-77X, PI-88X, PI-99X)',
    category: 'Process Indicators',
    series: 'PI Series',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-PI-XXX.pdf'
  },
  {
    id: 'pi-jd',
    name: 'PI-JD (PI-JD-2, PI-JD-4)',
    category: 'Process Indicators',
    series: 'PI-JD Series',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-AI-JD-X.pdf'
  },
  {
    id: 'ktc-jd',
    name: 'KTC-JD (KTC-JD-2, KTC-JD-4)',
    category: 'Process Indicators',
    series: 'PI-JD Series',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2023/02/OIM-KTC-JD-X.pdf'
  },
  {
    id: 'bl-xx',
    name: 'BL-XX (BL-44, BL-77, BL-88, BL-99)',
    category: 'Counters',
    series: 'BL Series',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-BL-XX.pdf'
  },
  {
    id: 'ctr-xx',
    name: 'CTR-XX (CTR-33, CTR-44, CTR-77, CTR-88, CTR-99)',
    category: 'Multifunction Timers & Counters',
    series: 'CTR Series',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-CTR-XX.pdf'
  },
  {
    id: 'cx-408',
    name: 'Cx-408 / Cx-428',
    category: 'Multifunction Timers & Counters',
    series: 'Cx Series',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2022/12/OIM-CX-408.pdf'
  },
  {
    id: 'cx-x28',
    name: 'Cx-X28 (Cx-728, Cx-928)',
    category: 'Multifunction Timers & Counters',
    series: 'Cx Series',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-Cx-X28.pdf'
  },
  {
    id: 'xtc-xx4',
    name: 'XTC-XX4 (XTC-774, XTC-994)',
    category: 'Multifunction Timers & Counters',
    series: 'XTC Series',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-XTC-XX4.pdf'
  },
  {
    id: 'ktm-xx3',
    name: 'KTM-XX3 (KTM-443, KTM-773, KTM-993)',
    category: 'Timers',
    series: 'KTM Series',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-KTM-XX3.pdf'
  },
  {
    id: 'ktm-xx6',
    name: 'KTM-XX6 (KTM-776, KTM-996)',
    category: 'Timers',
    series: 'KTM Series',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-KTM-XX6.pdf'
  },
  {
    id: 'ktm-448',
    name: 'KTM-448',
    category: 'Timers',
    series: 'KTM Series',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-KTM-XX8.pdf'
  },
  {
    id: 'xtm-xx3',
    name: 'XTM-XX3 (XTM-443, XTM-773, XTM-993)',
    category: 'Timers',
    series: 'XTM Series',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-XTM-XX3.pdf'
  },
  {
    id: 'humi-temp',
    name: 'HUMI-TEMP',
    category: 'Application Specific',
    series: 'Humidity Controller',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-Humi-Temp.pdf'
  },
  {
    id: 'rhtc-400',
    name: 'RHTC-400',
    category: 'Application Specific',
    series: 'Humidity Controller',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-RHTC-400.pdf'
  },
  {
    id: 'va-clave',
    name: 'VA-CLAVE',
    category: 'Application Specific',
    series: 'Auto Clave Controller',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-VA-Clave.pdf'
  },
  {
    id: 'vac-44',
    name: 'VAC-44',
    category: 'Application Specific',
    series: 'Auto Clave Controller',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-VAC-44.pdf'
  },
  {
    id: 'faac',
    name: 'FAAC',
    category: 'Application Specific',
    series: 'Auto Clave Controller',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-FAAC.pdf'
  },
  {
    id: 'faac-plus',
    name: 'FAAC +',
    category: 'Application Specific',
    series: 'Auto Clave Controller',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-FAAC-Pulse.pdf'
  },
  {
    id: 'ult-99',
    name: 'ULT-99',
    category: 'Application Specific',
    series: 'ULT Controller',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-ULT-99.pdf'
  },
  {
    id: 'ai-logger',
    name: 'AI-Logger',
    category: 'Application Specific',
    series: 'Data-LOGGER',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-AI-Logger.pdf'
  },
  {
    id: 'ai-usb-logger',
    name: 'AI-USB Logger',
    category: 'Application Specific',
    series: 'Data-LOGGER',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-AI-USB-Logger.pdf'
  },
  {
    id: 'va-logger',
    name: 'VA-Logger',
    category: 'Application Specific',
    series: 'Data-LOGGER',
    downloadUrl: 'https://backend.itherm.co.in/wp-content/uploads/2024/12/OIM-VA-Logger.pdf'
  }
];
