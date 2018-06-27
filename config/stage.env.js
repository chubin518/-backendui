'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

//预发布环境
module.exports = merge(prodEnv, {
  NODE_ENV: '"stage"'
})
