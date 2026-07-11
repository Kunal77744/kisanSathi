-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MandiPrice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "state" TEXT NOT NULL DEFAULT 'Madhya Pradesh',
    "district" TEXT NOT NULL,
    "mandi" TEXT NOT NULL,
    "crop" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "minPrice" REAL NOT NULL,
    "maxPrice" REAL NOT NULL,
    "modalPrice" REAL NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'manual_verified',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_MandiPrice" ("createdAt", "crop", "date", "district", "id", "mandi", "maxPrice", "minPrice", "modalPrice") SELECT "createdAt", "crop", "date", "district", "id", "mandi", "maxPrice", "minPrice", "modalPrice" FROM "MandiPrice";
DROP TABLE "MandiPrice";
ALTER TABLE "new_MandiPrice" RENAME TO "MandiPrice";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
