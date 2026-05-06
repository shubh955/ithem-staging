export interface DownloadItem {
  id: string;
  title: string;
  description?: string;
  type: 'catalog' | 'software';
  fileUrl: string;
  fileSize?: string;
  version?: string;
}

export const DOWNLOADS: DownloadItem[] = [
  {
    id: 'catalog-2019',
    title: 'I-Therm Catalog 2019',
    description: 'Complete product range including temperature controllers, timers, counters, and process indicators.',
    type: 'catalog',
    fileUrl: 'https://backend.itherm.co.in/wp-content/uploads/2021/04/I-THERM-CATALOG-2019.pdf',
    fileSize: '12 MB'
  },
  {
    id: 'tr-213-software',
    title: 'TR-213 Head Mounted Transmitter Software',
    description: 'Configuration utility software for the TR-213 series head mounted temperature transmitters.',
    type: 'software',
    fileUrl: 'https://backend.itherm.co.in/wp-content/uploads/2021/12/Temperature_Transmitter_TR-213.zip',
    version: 'v1.0'
  },
  {
    id: 'milleanium-converter',
    title: 'Milleanium Converter Utility',
    description: 'Specialized conversion tool for Milleanium series communication modules.',
    type: 'software',
    fileUrl: 'http://itherm.co.in/wp-content/uploads/2021/04/Milleanium-Converter.zip'
  },
  {
    id: 'itherm-pc-software',
    title: 'I-Therm PC Software Setup',
    description: 'Centralized PC application for monitoring and configuring I-Therm process control instruments.',
    type: 'software',
    fileUrl: 'https://backend.itherm.co.in/itherm_application_setup_131223/',
    version: 'Build 131223'
  }
];
