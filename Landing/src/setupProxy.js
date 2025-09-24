const express = require('express');
const path = require('path');

module.exports = function(app) {
  // Servir PDFs directamente desde public/Documentation
  app.use('/Documentation', express.static(path.join(__dirname, '../public/Documentation'), {
    setHeaders: (res, filePath) => {
      if (path.extname(filePath) === '.pdf') {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
      }
    }
  }));
};