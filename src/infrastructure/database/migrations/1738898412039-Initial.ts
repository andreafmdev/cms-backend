import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1738898412039 implements MigrationInterface {
  name = 'Initial1738898412039';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "permissions" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_48ce552495d14eae9b187bb6716" UNIQUE ("name"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "groups" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_664ea405ae2a10c264d582ee563" UNIQUE ("name"), CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "group_permissions" ("groupsId" integer NOT NULL, "permissionsId" integer NOT NULL, CONSTRAINT "PK_1d99369e6584a71a794fb03d47a" PRIMARY KEY ("groupsId", "permissionsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c847727ee9516445b563b50ddc" ON "group_permissions" ("groupsId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_af48409b16aefc75b044c7b73e" ON "group_permissions" ("permissionsId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_groups" ("usersId" integer NOT NULL, "groupsId" integer NOT NULL, CONSTRAINT "PK_e8957e0d8605411be303ad2b115" PRIMARY KEY ("usersId", "groupsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b184a9372d30d296d40638f8a8" ON "user_groups" ("usersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_283e36ff3f2c3afe7e3488ac3e" ON "user_groups" ("groupsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "group_permissions" ADD CONSTRAINT "FK_c847727ee9516445b563b50ddc1" FOREIGN KEY ("groupsId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_permissions" ADD CONSTRAINT "FK_af48409b16aefc75b044c7b73ed" FOREIGN KEY ("permissionsId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_groups" ADD CONSTRAINT "FK_b184a9372d30d296d40638f8a8e" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_groups" ADD CONSTRAINT "FK_283e36ff3f2c3afe7e3488ac3eb" FOREIGN KEY ("groupsId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_groups" DROP CONSTRAINT "FK_283e36ff3f2c3afe7e3488ac3eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_groups" DROP CONSTRAINT "FK_b184a9372d30d296d40638f8a8e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_permissions" DROP CONSTRAINT "FK_af48409b16aefc75b044c7b73ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "group_permissions" DROP CONSTRAINT "FK_c847727ee9516445b563b50ddc1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_283e36ff3f2c3afe7e3488ac3e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b184a9372d30d296d40638f8a8"`,
    );
    await queryRunner.query(`DROP TABLE "user_groups"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_af48409b16aefc75b044c7b73e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c847727ee9516445b563b50ddc"`,
    );
    await queryRunner.query(`DROP TABLE "group_permissions"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "groups"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
  }
}
