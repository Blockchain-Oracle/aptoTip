import { createUploadthing, type FileRouter } from "uploadthing/next";
import { generateReactHelpers } from "@uploadthing/react";

const f = createUploadthing();

export const uploadRouter = {
  profileImage: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      return { uploadedAt: new Date().toISOString() };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Profile image uploaded:", file.url);
    }),

  bannerImage: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      return { uploadedAt: new Date().toISOString() };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Banner image uploaded:", file.url);
    }),

  portfolioImages: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 10,
    },
  })
    .middleware(async () => {
      return { uploadedAt: new Date().toISOString() };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Portfolio image uploaded:", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>(); 