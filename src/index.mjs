import helper from "./helper.mjs";
import categories from "./categories.mjs";
import S3Uploader from "./s3Helper.mjs";

export const handler = async (event, context) => {
    const s3Uploader = new S3Uploader();
    const bucket = "ntv-data";
    const baseKey = helper.getYesterdaysDate().toISOString().split("T")[0];
    for (let category of categories) {
        let { links, rss } = await helper.getLinksOfYesterdaysArticelsAndRssObjectOf(category);
        if (links.length == 0) {
            continue;
        }
        let rssKey = baseKey + "/" + category + "/rss.json";
        let rssJSONString = JSON.stringify(rss);
        await s3Uploader.uploadContent(bucket, rssKey, rssJSONString);
        for (let link of links) {
            let articleKey = baseKey + "/" + category + "/" + helper.getFileNameFromLink(link);
            let htmlContent = await helper.downloadContentFrom(link);
            let cleanedHTML = helper.cleanHTMLContent(htmlContent);
            await s3Uploader.uploadContent(bucket, articleKey, cleanedHTML);
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify("Hello from Lambda!"),
    };
};
