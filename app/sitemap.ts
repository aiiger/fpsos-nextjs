export default function sitemap() {
  const baseUrl = 'https://fpsos.gg'
  const routes = [
    '',
    '/packages',
    '/diagnostic',
    '/faq',
    '/contact',
    '/terms',
    '/privacy'
  ]

  return routes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8
  }))
}
