"use strict";

// source: https://github.com/webpack/webpack-dev-server/blob/master/lib/utils/getCertificate.js

const path = require("path");
const fs = require("fs");
const os = require("os");
const del = require("del");
const findCacheDir = require("find-cache-dir");
const createCertificate = require("./createCertificate");

function getCertificate(logger) {
  // Use a self-signed certificate if no certificate was configured.
  // Cycle certs every 24 hours
  const certificateDir =
    findCacheDir({ name: "webpack-dev-server" }) || os.tmpdir();
  const certificatePath = path.join(certificateDir, "server.pem");

  let certificateExists = fs.existsSync(certificatePath);

  if (certificateExists) {
    const certificateTtl = 1000 * 60 * 60 * 24;
    const certificateStat = fs.statSync(certificatePath);

    const now = new Date();

    // cert is more than 30 days old, kill it with fire
    if ((now - certificateStat.ctime) / certificateTtl > 30) {
      logger &&
        logger.info("SSL Certificate is more than 30 days old. Removing.");

      del.sync([certificatePath], { force: true });

      certificateExists = false;
    }
  }

  if (!certificateExists) {
    logger && logger.info("Generating SSL Certificate");

    const attributes = [{ name: "commonName", value: "localhost" }];
    const pems = createCertificate(attributes);

    fs.mkdirSync(certificateDir, { recursive: true });
    fs.writeFileSync(certificatePath, pems.private + pems.cert, {
      encoding: "utf8",
    });
  }

  return fs.readFileSync(certificatePath);
}

module.exports = getCertificate;
