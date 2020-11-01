import { container } from "tsyringe";
import uploadConfig from "@config/upload";

import IStoragedProvider from "./models/IStorageProvider";

import S3StorageProvider from "./implementations/S3StorageProvider";
import DiskStorageProvider from "./implementations/DiskStorageProvider";

const providers = {
    disk: DiskStorageProvider,
    s3: S3StorageProvider,
};

container.registerSingleton<IStoragedProvider>(
    "StorageProvider",
    providers[uploadConfig.driver]
);
