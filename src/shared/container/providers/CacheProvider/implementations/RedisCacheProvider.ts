import Redis, { Redis as RedisClient } from "ioredis";
import cacheConfig from "@config/cache";

import ICacheProvider from "../models/ICacheProvider";

export default class RedisCacheProvider implements ICacheProvider {
    private client: RedisClient;
    constructor() {
        this.client = new Redis(cacheConfig.config.redis);
    }

    public async save(key: string, value: any): Promise<void> {
        this.client.set(key, JSON.stringify(value));
    }

    public async recover<T>(key: string): Promise<T | null> {
        const data = await this.client.get(key);

        if (!data) {
            return null;
        }

        const parsedData = JSON.parse(data) as T;

        return parsedData;
    }

    // provider-appointments:362a40dd-3ad0-463c-9678-734b28e582ce-2020-11-3
    // provider-appointments:362a40dd-3ad0-463c-9678-734b28e582ce:2020-11-3

    public async invalidate(key: string): Promise<void> {
        await this.client.del(key);
    }

    public async invalidatePrefix(prefix: string): Promise<void> {
        const keys = await this.client.keys(`${prefix}:*`);

        const pipeline = await this.client.pipeline();

        keys.forEach((key) => {
            pipeline.del(key);
        });

        await pipeline.exec();
    }
}
