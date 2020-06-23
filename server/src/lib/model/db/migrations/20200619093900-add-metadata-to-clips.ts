export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
      ALTER TABLE
        clips
      ADD COLUMN status TEXT DEFAULT NULL,
      ADD COLUMN empty BOOLEAN DEFAULT FALSE,
      ADD COLUMN sample_rate INTEGER DEFAULT NULL,
      ADD COLUMN duration INTEGER DEFAULT NULL,
      ADD COLUMN size INTEGER DEFAULT NULL
    `
  );
};

export const down = function(): Promise<any> {
  return null;
};
