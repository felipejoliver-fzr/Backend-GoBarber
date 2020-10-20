import { container } from "tsyringe";

import IStoragedProvider from "./StoragedProvider/models/IStorageProvider";
import DiskStorageProvider from "./StoragedProvider/implementations/DiskStorageProvider";

import IMailProvider from "./MailProvider/Models/IMailProvider";

container.registerSingleton<IStoragedProvider>(
    "StorageProvider",
    DiskStorageProvider
);

// container.registerSingleton<IMailProvider>(
//     "StorageProvider",
//     MailProvider
// );
