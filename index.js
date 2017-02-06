var Metalsmith  = require('metalsmith');
var markdown    = require('metalsmith-markdown');
var layouts     = require('metalsmith-layouts');
var permalinks  = require('metalsmith-permalinks');
var sass        = require('metalsmith-sass');
var collections = require('metalsmith-collections');
var s3          = require('metalsmith-s3');
var msIf        = require('metalsmith-if');
var partials    = require('metalsmith-discover-partials');
var redirect    = require('metalsmith-redirect');
var serve       = require('metalsmith-serve');
var formatcheck = require('metalsmith-formatcheck');
var debug       = require('metalsmith-debug');

const latestArticleSlug = 'beautify-your-rails-confirm-boxes-in-a-few-seconds';

Metalsmith(__dirname)
  .metadata({
    title: "Nicolas Blanco",
    description: "The home of a passionate Web architect",
    generator: "Metalsmith",
    url: "http://nicolasblan.co"
  })
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
    '/blog': `/blog/${latestArticleSlug}`
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
    if (err) { throw err; }
  })
