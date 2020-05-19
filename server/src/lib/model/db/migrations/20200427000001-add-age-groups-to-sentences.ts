export const up = async function(db: any): Promise<any> {
  return db.runSql(
    `
          ALTER TABLE sentences
          ADD age VARCHAR(255) NOT NULL DEFAULT "adults";
        `
  );
};

export const down = function(): Promise<any> {
  return null;
};
