// https://www.npmjs.com/package/fs-extra

module.exports = {
  copyQRCodeGenerator: {
    src: ['node_modules/qrcode-generator/qrcode.js'],
    dest: '{{BUILD}}/qrcode-generator'
  },
  copyCertificates: {
    src: ['resources/certificates/**'],
    dest: '{{WWW}}/certificates'
  },
  copyTotp: {
    src: ['resources/aerogear/**'],
    dest: '{{WWW}}/aerogear'
  }
};
