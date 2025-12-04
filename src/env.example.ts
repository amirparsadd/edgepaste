export const S3: {
  accessKey: string,
  secretKey: string,
  endpoint: string,
  bucket: string
} = {
  accessKey: "123",
  secretKey: "123",
  endpoint: "example.com",
  bucket: "bucketname"
}

export const DEV: {
  PORT: number,
  HOSTNAME?: string | undefined
} = {
  PORT: 3000,
  HOSTNAME: undefined
}

export const BASE_URL = "http://localhost:3000"