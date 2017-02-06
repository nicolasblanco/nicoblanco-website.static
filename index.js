var Metalsmith  = require('metalsmith');
var markdown    = require('metalsmith-markdown');
var layouts     = require('metalsmith-layouts');
var permalinks  = require('metalsmith-permalinks');
var sass        = require('metalsmith-sass');
var s3          = require('metalsmith-s3');
var msIf        = require('metalsmith-if');
var partials    = require('metalsmith-discover-partials');
var redirect    = require('metalsmith-redirect');
var serve       = require('metalsmith-serve');

const latestArticleSlug = 'beautify-your-rails-confirm-boxes-in-a-few-seconds';

Metalsmith(__dirname)
  .metadata({
    title: "My Static Site & Blog",
    description: "It's about saying »Hello« to the World.",
    generator: "Metalsmith",
    url: "http://www.metalsmith.io/"
  })
  .source('./src')
  .destination('./build')
  .clean(true)
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
