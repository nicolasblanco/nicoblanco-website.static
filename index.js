'use strict'

const Metalsmith    = require('metalsmith')
const markdown      = require('metalsmith-markdown')
const layouts       = require('metalsmith-layouts')
const permalinks    = require('metalsmith-permalinks')
const sass          = require('metalsmith-sass')
const collections   = require('metalsmith-collections')
const s3            = require('metalsmith-s3')
const msIf          = require('metalsmith-if')
const partials      = require('metalsmith-discover-partials')
const redirect      = require('metalsmith-redirect')
const serve         = require('metalsmith-serve')
const formatcheck   = require('metalsmith-formatcheck')
const debug         = require('metalsmith-debug')

const metadata = {
  title: 'Nicolas Blanco',
  description: 'The home of a passionate Web architect',
  generator: 'Metalsmith',
  url: 'http://nicolasblan.co',
  last_article_slug: 'beautify-your-rails-confirm-boxes-in-a-few-seconds'
}

Metalsmith(__dirname)
  .metadata(metadata)
  .source('./src')
  .destination('./build')
  .clean(true)
  .use(collections({
    articles: {
      pattern: 'blog/*.html',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(markdown())
  .use(permalinks())
  .use(partials())
  .use(layouts({
    engine: 'handlebars'
  }))
  .use(sass({
    outputDir: 'css/'
  }))
  .use(redirect({
    '/blog': `/blog/${metadata.last_article_slug}`
  }))
  //.use(formatcheck({ verbose: true }))
  .use(msIf(
    process.env.NODE_ENV != 'production', serve()
  ))
  .use(msIf(
    process.env.NODE_ENV == 'production', s3({
      action: 'write',
      bucket: 'nicolasblan.co',
      region: 'eu-west-1'
  })))
  .build(function(err, files) {
    if (err) { throw err }
  })
