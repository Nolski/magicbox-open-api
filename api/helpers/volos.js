/****************************************************************************
 The MIT License (MIT)
 Copyright (c) 2014 Apigee Corporation
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
'use strict';

var debug = require('debug')('helpers');

module.exports = {
  cacheCountry,
  cachePopCountries,
  cacheMosquitoKinds,
  cacheCases,
  cacheMosquitoByCountry
};

// Checks for the 'country' query param from the API request
// and returns it to be used as the cache name
function cacheCountry(req) {
  var catcheKey = 'population_' + req.swagger.params.country.value;
  if (debug.enabled) { debug('Cache Key: '+ catcheKey); }
  return catcheKey;
}

function cachePopCountries(req) {
  var key = 'population';
  if (debug.enabled) { debug('Cache Key: '+key); }
  return key;
}

function cacheMosquitoKinds(req) {
  var key = req.swagger.params.kind.value;
  if (debug.enabled) { debug('Cache Key: '+key); }
  return key;
}

function cacheCases(req) {
  var key = 'cases';
  if (debug.enabled) { debug('Cache Key: '+key); }
  return key;
}

function cacheMosquitoByCountry(req) {
  var key = req.swagger.params.kind.value + '_' + req.swagger.params.country.value
  if (debug.enabled) { debug('Cache Key: '+ key); }
  return key;
}
