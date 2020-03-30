export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
      CREATE TABLE IF NOT EXISTS consents (
        id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        kennitala VARCHAR(10) DEFAULT NULL,
        email VARCHAR(255) DEFAULT NULL,
        permission BOOLEAN NOT NULL DEFAULT FALSE,
        uuid VARCHAR(255) DEFAULT NULL,
        UNIQUE KEY uuid (uuid)
      );
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
