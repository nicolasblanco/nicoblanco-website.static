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
const serve         = require('metalsmith-serve')
const debug         = require('metalsmith-debug')

const metadata = {
  title: 'Nicolas Blanco',
  description: 'The home of a passionate Web architect',
  generator: 'Metalsmith',
  url: 'http://nicolasblan.co',
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
  .use((files, metalsmith, done) => {
    files['blog/index.html'] = metalsmith.metadata().articles[0]
    done()
  })
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
