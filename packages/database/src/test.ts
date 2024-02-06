// import { PrismaClient } from "@prisma/client";
// import { LangChainSchema } from "./database/langchain";
// import { UserSchema } from "./database/user";

// async function main() {
//   //
//   const client = new PrismaClient();
//   const langChainSchema = new LangChainSchema(client);
//   const userSchema = new UserSchema(client);
//   //
//   const { id: userId } = (await userSchema.getUser("test")) as any;
//   await langChainSchema.model.addOrActivateEmbeddingModel(
//     "EmbeddingModelId",
//     1,
//     2,
//   );
//   await langChainSchema.addDocument(
//     {
//       content: "Content",
//       localLocation: "LocalLocation",
//       name: "Name",
//     },
//     {
//       userId: userId,
//     },
//     {
//       embedding: [1, 3, 4, 5],
//       modelName: "EmbeddingModelId",
//     },
//     {
//       global: true,
//       metadata: {
//         metadata: "Metadata",
//       },
//     },
//   );
// }

// await main()
//   .then(() => {
//     console.log("Done");
//   })
//   .catch((error) => {
//     console.error(error);
//   });
