import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function getCachedData<T>(key: string, fetchFn: () => Promise<T>, ttl: number = 60): Promise<T> {
  const cachedData = await redis.get(key)
  if (cachedData) {
    return JSON.parse(cachedData as string) as T
  }

  const freshData = await fetchFn()
  await redis.set(key, JSON.stringify(freshData), { ex: ttl })
  return freshData
}

export async function invalidateCache(key: string): Promise<void> {
  await redis.del(key)
}

