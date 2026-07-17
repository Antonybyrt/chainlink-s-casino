module.exports = class Data1784131558998 {
    name = 'Data1784131558998'

    async up(db) {
        await db.query(`CREATE TABLE "transfer" ("id" character varying NOT NULL, "from" text NOT NULL, "to" text NOT NULL, "value" numeric NOT NULL, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "idx_transfer_from_3d310ced" ON "transfer" ("from") `)
        await db.query(`CREATE INDEX "idx_transfer_to_b90faa67" ON "transfer" ("to") `)
    }

    async down(db) {
        await db.query(`DROP INDEX "public"."idx_transfer_to_b90faa67"`)
        await db.query(`DROP INDEX "public"."idx_transfer_from_3d310ced"`)
        await db.query(`DROP TABLE "transfer"`)
    }
}
