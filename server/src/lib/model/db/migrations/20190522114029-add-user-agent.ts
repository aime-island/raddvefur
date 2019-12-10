export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
        ALTER TABLE clips ADD COLUMN user_agent TEXT;
      `
  );
};

export const down = function(): Promise<any> {
  return null;
};
