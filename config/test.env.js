'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')
// Test测试环境
module.exports = merge(devEnv, {
  NODE_ENV: '"testing"'
})
