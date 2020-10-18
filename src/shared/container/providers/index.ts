import { container } from "tsyringe";

import IStoragedProvider from "./StoragedProvider/models/IStorageProvider";
import DiskStorageProvider from "./StoragedProvider/implementations/DiskStorageProvider";

container.registerSingleton<IStoragedProvider>(
    "StorageProvider",
    DiskStorageProvider
);
