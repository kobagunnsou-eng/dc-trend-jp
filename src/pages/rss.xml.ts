// RSSフィード生成
// /rss.xml として配信する

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_CONFIG } from '../config/site';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const articles = (await getCollection('articles', ({ data }) => !data.draft))
    .sort((a, b) => b.data.published_at.localeCompare(a.data.published_at))
    .slice(0, 20); // 最新20件

  return rss({
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    site: context.site ?? SITE_CONFIG.url,
    items: articles.map(article => ({
      title: article.data.title,
      description: article.data.summary,
      link: `/articles/${article.data.slug}/`,
      pubDate: new Date(article.data.published_at),
      categories: [article.data.category],
    })),
    customData: '<language>ja</language>',
  });
}
