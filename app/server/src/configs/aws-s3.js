import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3"

export const s3 = new S3Client({ region: "us-east-1" });

const S3FetchOffersParams = {
    Bucket: process.env.AWS_IMAGE_BUCKET,
    Prefix: "offer-banners/"
};
// const { data: bannerList } = await api.get("/offer-list");
export const S3FetchOffersCommand = new ListObjectsV2Command(S3FetchOffersParams);