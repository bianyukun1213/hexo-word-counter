/* global hexo */

'use strict';

const helper = require('./lib/helper');
const { wordCount } = require('./index.node');

const rBacktick = /^((?:[^\S\r\n]*>){0,3}[^\S\r\n]*)(`{3,}|~{3,})[^\S\r\n]*((?:.*?[^`\s])?)[^\S\r\n]*\n((?:[\s\S]*?\n)?)(?:(?:[^\S\r\n]*>){0,3}[^\S\r\n]*)\2[^\S\r\n]?(\n+|$)/gm;

const rImg = /!\[([^\]]*)\]\((\S+?)(?:\s+(['"])(.*?)\3)?\)/g;
const rImgMasonry = /\{%\s*image_masonry[\s\S]*?%\}/g;

hexo.config.symbols_count_time = Object.assign({
  symbols          : true,
  time             : true,
  total_symbols    : true,
  total_time       : true,
  exclude_codeblock: false,
  wpm              : 275,
  suffix           : 'mins.'
}, hexo.config.symbols_count_time);
const config = hexo.config.symbols_count_time;

helper.setConfig(config);

if (config.symbols) {
  hexo.extend.helper.register('symbolsCount', helper.symbolsCount);
  hexo.extend.helper.register('wordcount', helper.symbolsCount);
}

if (config.time) {
  hexo.extend.helper.register('symbolsTime', helper.symbolsTime);
  hexo.extend.helper.register('min2read', helper.symbolsTime);
}

if (config.total_symbols) {
  hexo.extend.helper.register('symbolsCountTotal', helper.symbolsCountTotal);
  hexo.extend.helper.register('totalcount', helper.symbolsCountTotal);
}

if (config.total_time) {
  hexo.extend.helper.register('symbolsTimeTotal', helper.symbolsTimeTotal);
}

if (config.symbols || config.time || config.total_symbols || config.total_time) {
  hexo.extend.filter.register('after_post_render', data => {
    let { _content } = data;
    if (config.exclude_codeblock) _content = _content.replace(rBacktick, '');
    // 为 his2nd.life 去除影响字数统计的图片替代文本。
    _content = _content.replace(rImg, '');
    _content = _content.replace(rImgMasonry, '');
    data.length = wordCount(_content);
  }, 0);
}
