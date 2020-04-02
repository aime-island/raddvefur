export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
        ALTER TABLE clips
        ADD institution VARCHAR(255) DEFAULT NULL,
        ADD division VARCHAR(255) DEFAULT NULL;
      `
  );
};

export const down = function(): Promise<any> {
  return null;
};
