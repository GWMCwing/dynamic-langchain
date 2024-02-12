-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "chat";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "extensions";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "langchain";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "users";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "extensions";

-- CreateEnum
CREATE TYPE "langchain"."document_language" AS ENUM ('cpp', 'go', 'java', 'js', 'php', 'proto', 'python', 'rst', 'ruby', 'rust', 'scala', 'swift', 'markdown', 'latex', 'html');

-- CreateTable
CREATE TABLE "users"."user" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users"."user_session" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "expired_at" TIMESTAMPTZ NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat"."session" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat"."session_config" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "config" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "session_id" TEXT NOT NULL,
    "generation_model_id" TEXT NOT NULL,

    CONSTRAINT "session_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat"."session_document" (
    "document_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,

    CONSTRAINT "session_document_pkey" PRIMARY KEY ("document_id","session_id")
);

-- CreateTable
CREATE TABLE "langchain"."document" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "local_location" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "content_embedding_truncated" BOOLEAN,
    "metadata" JSON NOT NULL DEFAULT '{}',
    "language" "langchain"."document_language",
    "global" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "langchain"."document_embedding" (
    "document_id" TEXT NOT NULL,
    "embedding_id" TEXT NOT NULL,

    CONSTRAINT "document_embedding_pkey" PRIMARY KEY ("document_id","embedding_id")
);

-- CreateTable
CREATE TABLE "langchain"."memory_embedding" (
    "memory_id" TEXT NOT NULL,
    "embedding_id" TEXT NOT NULL,

    CONSTRAINT "memory_embedding_pkey" PRIMARY KEY ("memory_id","embedding_id")
);

-- CreateTable
CREATE TABLE "langchain"."embedding" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "embedding" DOUBLE PRECISION[],
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "embedding_model_id" TEXT NOT NULL,

    CONSTRAINT "embedding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "langchain"."memory" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "question" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "content_embedding_truncated" BOOLEAN,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "session_id" TEXT NOT NULL,

    CONSTRAINT "memory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "langchain"."embedding_model" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "contentLength" INTEGER NOT NULL,
    "dimension" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "embedding_model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "langchain"."generation_model" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "generation_model_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_name_key" ON "users"."user"("name");

-- CreateIndex
CREATE INDEX "idx_user_id" ON "chat"."session"("user_id");

-- CreateIndex
CREATE INDEX "idx_created_at" ON "chat"."session"("created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "session_user_id_name_key" ON "chat"."session"("user_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "session_config_session_id_key" ON "chat"."session_config"("session_id");

-- CreateIndex
CREATE INDEX "idx_session_id" ON "chat"."session_config"("session_id");

-- CreateIndex
CREATE INDEX "idx_session_document_session_id" ON "chat"."session_document"("session_id");

-- CreateIndex
CREATE INDEX "idx_session_document_document_id" ON "chat"."session_document"("document_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_document_document_id_session_id_key" ON "chat"."session_document"("document_id", "session_id");

-- CreateIndex
CREATE INDEX "idx_user_id" ON "langchain"."document"("user_id");

-- CreateIndex
CREATE INDEX "idx_global" ON "langchain"."document"("global");

-- CreateIndex
CREATE UNIQUE INDEX "document_user_id_name_key" ON "langchain"."document"("user_id", "name");

-- CreateIndex
CREATE INDEX "idx_document_embedding_document_id" ON "langchain"."document_embedding"("document_id");

-- CreateIndex
CREATE UNIQUE INDEX "document_embedding_document_id_embedding_id_key" ON "langchain"."document_embedding"("document_id", "embedding_id");

-- CreateIndex
CREATE INDEX "idx_memory_embedding_memory_id" ON "langchain"."memory_embedding"("memory_id");

-- CreateIndex
CREATE UNIQUE INDEX "memory_embedding_memory_id_embedding_id_key" ON "langchain"."memory_embedding"("memory_id", "embedding_id");

-- CreateIndex
CREATE UNIQUE INDEX "memory_session_id_key" ON "langchain"."memory"("session_id");

-- CreateIndex
CREATE INDEX "idx_session_id" ON "langchain"."memory"("session_id");

-- CreateIndex
CREATE INDEX "idx_session_id_created_at" ON "langchain"."memory"("session_id", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "embedding_model_name_key" ON "langchain"."embedding_model"("name");

-- CreateIndex
CREATE INDEX "idx_embedding_model_name" ON "langchain"."embedding_model"("name");

-- CreateIndex
CREATE UNIQUE INDEX "generation_model_name_key" ON "langchain"."generation_model"("name");

-- CreateIndex
CREATE INDEX "idx_generation_model_name" ON "langchain"."generation_model"("name");

-- AddForeignKey
ALTER TABLE "users"."user_session" ADD CONSTRAINT "user_session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat"."session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat"."session_config" ADD CONSTRAINT "session_config_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "chat"."session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat"."session_config" ADD CONSTRAINT "session_config_generation_model_id_fkey" FOREIGN KEY ("generation_model_id") REFERENCES "langchain"."generation_model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat"."session_document" ADD CONSTRAINT "session_document_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "langchain"."document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat"."session_document" ADD CONSTRAINT "session_document_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "chat"."session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "langchain"."document" ADD CONSTRAINT "document_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "langchain"."document_embedding" ADD CONSTRAINT "document_embedding_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "langchain"."document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "langchain"."document_embedding" ADD CONSTRAINT "document_embedding_embedding_id_fkey" FOREIGN KEY ("embedding_id") REFERENCES "langchain"."embedding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "langchain"."memory_embedding" ADD CONSTRAINT "memory_embedding_memory_id_fkey" FOREIGN KEY ("memory_id") REFERENCES "langchain"."memory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "langchain"."memory_embedding" ADD CONSTRAINT "memory_embedding_embedding_id_fkey" FOREIGN KEY ("embedding_id") REFERENCES "langchain"."embedding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "langchain"."embedding" ADD CONSTRAINT "embedding_embedding_model_id_fkey" FOREIGN KEY ("embedding_model_id") REFERENCES "langchain"."embedding_model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "langchain"."memory" ADD CONSTRAINT "memory_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "chat"."session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
