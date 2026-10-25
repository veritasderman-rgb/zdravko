/**
 * Mazání podle lhůt uchování ručně (jinak běží denně přes /cron/retence):
 *
 *   pnpm gdpr:retence
 *
 * Smaže nepotvrzené veřejné připomínky starší 7 dní, záznamy limitů starší 30 dní
 * a u veřejných připomínek starších 24 měsíců odstraní jméno a e-mail.
 */
import "dotenv/config";
import { withPoolDb } from "../src/db/pool";
import { applyRetention } from "../src/lib/privacy-core";

withPoolDb((db) => applyRetention(db))
  .then((r) => {
    console.log(`nepotvrzené připomínky: ${r.unverified}, záznamy limitů: ${r.rateHits}, anonymizované připomínky: ${r.anonymized}, prošlé odkazy pro přihlášení: ${r.loginTokens}`);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
