import { MigrationInterface, QueryRunner } from "typeorm";

export class PostCreate1726687629389 implements MigrationInterface {
    name = 'PostCreate1726687629389'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "producto" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "codigo" character varying NOT NULL, "nombre" character varying NOT NULL, "precioA" numeric(10,2) NOT NULL, "precioB" numeric(10,2) NOT NULL, "precioC" numeric(10,2) NOT NULL, "urlImagen" character varying NOT NULL, "cantMinPed" integer NOT NULL, "cantMaxPed" integer NOT NULL, "descripcion" text, "informacionNutricional" text, "razonEliminacion" text, "estado" boolean NOT NULL DEFAULT true, "usuarioCreacion" character varying NOT NULL, "usuarioActualizacion" character varying NOT NULL, "seVendeEcommerce" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_4ecaa777d3efc10b5a6327cfe42" UNIQUE ("codigo"), CONSTRAINT "PK_5be023b11909fe103e24c740c7d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "producto"`);
    }

}
