import { container } from "tsyringe";

import IStoragedProvider from "./models/IStorageProvider";
import DiskStorageProvider from "./implementations/DiskStorageProvider";

const providers = {
    disk: DiskStorageProvider,
};

container.registerSingleton<IStoragedProvider>(
    "StorageProvider",
    providers.disk
);
