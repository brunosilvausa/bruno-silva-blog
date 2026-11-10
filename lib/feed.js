// RSS link for <head>. Pages that set their own `alternates` (canonical) must repeat it, because
// Next replaces the whole `alternates` object instead of merging it with the layout's.
export const FEED_TYPES = { 'application/rss+xml': [{ url: '/rss.xml', title: 'Blog Bruno Silva USA' }] };
