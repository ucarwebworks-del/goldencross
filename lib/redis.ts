import Redis from 'ioredis';

const getRedisClient = () => {
    const redisUrl = process.env.REDIS_URL;
    
    if (!redisUrl) {
        throw new Error('REDIS_URL environment variable is not set');
    }
    
    return new Redis(redisUrl);
};

// Singleton pattern for Redis client
let redisClient: Redis | null = null;

export const redis = () => {
    if (!redisClient) {
        redisClient = getRedisClient();
    }
    return redisClient;
};

// Helper functions for common operations
export async function getFromRedis<T>(key: string): Promise<T | null> {
    try {
        const data = await redis().get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(`Error getting ${key} from Redis:`, error);
        return null;
    }
}

export async function setToRedis<T>(key: string, value: T): Promise<void> {
    try {
        await redis().set(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error setting ${key} to Redis:`, error);
    }
}

export async function deleteFromRedis(key: string): Promise<void> {
    try {
        await redis().del(key);
    } catch (error) {
        console.error(`Error deleting ${key} from Redis:`, error);
    }
}

export default redis;
