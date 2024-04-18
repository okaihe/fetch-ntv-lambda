import { XMLParser } from "fast-xml-parser";

function buildRSSLinkFromCategory(category) {
    let domain = "https://www.n-tv.de/";
    let postfix = "/rss";
    return domain + category + postfix;
}

function getYesterdaysDate() {
    const date = new Date();
    date.setHours(date.getHours() + 2);
    date.setDate(date.getDate() - 1);
    return date;
}

function dateWasYesterday(datestring) {
    const yesterdaysDate = getYesterdaysDate();
    const parsedDate = new Date(datestring);
    return (
        yesterdaysDate.getFullYear() == parsedDate.getFullYear() &&
        yesterdaysDate.getMonth() == parsedDate.getMonth() &&
        yesterdaysDate.getDate() == parsedDate.getDate()
    );
}

function parseXMLString(xmlstring) {
    const parser = new XMLParser();
    return parser.parse(xmlstring);
}

function getRssItemsOfYesterday(rssObject) {
    if (rssObject.rss.channel.item == undefined) {
        return [];
    }
    let items = rssObject.rss.channel.item;
    return items.filter((item) => dateWasYesterday(item.pubDate));
}

async function downloadRssXMLOfCategory(category) {
    let url = buildRSSLinkFromCategory(category);
    return await downloadContentFrom(url);
}

async function downloadContentFrom(url) {
    let response = await fetch(url);
    return await response.text();
}

function getFileNameFromLink(link) {
    return link.split("/").at(-1);
}

function getLinksOfRssItems(rssItems) {
    let links = [];
    for (let item of rssItems) {
        links.push(item.link);
    }
    return links;
}

async function getLinksOfYesterdaysArticelsAndRssObjectOf(category) {
    let rssXMLString = await downloadRssXMLOfCategory(category);
    let rss = parseXMLString(rssXMLString);
    let yesterdaysItems = getRssItemsOfYesterday(rss);
    let links = getLinksOfRssItems(yesterdaysItems);
    rss.rss.channel.item = yesterdaysItems;
    rss.rss.channel.category = category;
    return { links: links, rss: rss };
}

export default { getYesterdaysDate, getLinksOfYesterdaysArticelsAndRssObjectOf, getFileNameFromLink, downloadContentFrom };
