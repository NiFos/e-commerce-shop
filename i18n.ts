/* eslint-disable @typescript-eslint/no-var-requires */
import NextI18Next from 'next-i18next';
import path from 'path';

const i18n = new NextI18Next({
  defaultLanguage: 'en',
  otherLanguages: ['ru'],
  localePath: path.resolve('./public/static/locales'),
  defaultNS: 'common',
  strictMode: false,
});
export default i18n;
