import * as general_helper from '../helpers/general'
import config from '../../config'
import * as auth from '../helpers/auth'
import qs from 'qs'
import * as logger from './../helpers/logger'

/**
 * Returns mosquito prevalence for specified country. If country is not specified it will return
 * mosquito prevalence for all countries.
 * @param{String} request - request object
 * @param{String} response - response object
 * @return{Promise} Fulfilled when records are returned
 */
export function getMosquito(request, response) {
  // let [ key, kind, country ] = request._key.split('_')

  let key = 'mosquito'
  let {kind: kind, country: country} = getParams(request)


  const source = config[key].source
  const source_url = config[key].source_url
  return general_helper
    .getMosquito(key, kind, country)
    .then(data => {
      response.json({
      key: key,
      kind: kind,
      source: source,
      source_url: source_url,
      data: data
    })
  })
    .catch(err => {
      logger.logErrorResponse(request, err)
      response.json({message: err})
    })
}

/**
 * Returns population metadata available from specified source for specified country.
 * If country is not specified it will return data for all countries.
 * Default source is worldpop.
 * @param{String} request - request object
 * @param{String} response - response object
 * @return{Promise} Fulfilled when records are returned
 */
export function getPopulation(request, response) {
  // const [ key, source, country ] = request._key.split('_')

  let key = 'population'

  // When no source or country are specified: 'population'
  // If country is specified: [ worldpop, country_name ]

  let {
    source = config.population.default_source,
    country: country
  } = getParams(request)

  const data_source = (source !== undefined) ? source : config.population.source
  return general_helper
    .getPopulation(key, source, country)
    .then(data => {
      return response.json({
        key: key,
        source: data_source,
        data: data
      })
    })
    .catch(err => {
      logger.logErrorResponse(request, err)
      response.json({message: err})
    })
}


/**
 * Returns an object with information about cases for specific kind in all countries
 * @param{String} request - request object
 * @param{String} response - response object
 * @return{Promise} Fulfilled when records are returned
 */
export function getCases(request, response) {
  // key represents what data we want to pull, here it is 'cases'
  // kind represents disease whose cases we are pulling
  // week-types (epi-week or iso-week)
  // week represents last date of epi-week. If set, the API will fetch cases only for that week

  // const [ key, kind, weekType, week ] = request._key.split('_')

  let key = 'cases'
  let {kind: kind, weekType: weekType, date: week} = getParams(request)

  const source = config.cases[kind].source
  const source_url = config.cases[kind].source_url

  return general_helper
    .get_cases(key, kind, weekType, week)
    .then(cases => {
      return response.json({
      kind: kind,
      source: source,
      source_url: source_url,
      weekType: weekType,
      cases: cases
    })
  })
    .catch(error => {
      logger.logErrorResponse(request, error)
      response.json({message: error})
    })
}


/**
 * Returns an object with properties for specific key
 * @param{String} request - request object
 * @param{String} response - response object
 * @return{Promise} Fulfilled when records are returned
 */
export function getProperties(request, response) {
  // key was request._key before

  let key = request.swagger.apiPath.split('/')[2]
  let params = getParams(request)

  if (key === 'population') {
    if (!('source' in params)) {
      params.source = config.population.default_source
    }
  }

  if (Object.keys(params).length > 0) {
    key += '_' + Object.keys(params).map(property => {
      return params[property]
    }).join('_')
  }

  return general_helper
  .getProperties(key)
  .then(properties => {
    return response.json({
      key: properties.key,
      properties: properties.properties
    })
  })
  .catch(err => {
    logger.logErrorResponse(request, err)
    return reject(err)
  })
}

/**
 * Returns a clickable link to Auth0 for users to login and get access token
 * @param{String} request - request object
 * @param{String} response - response object
 */
export const getToken = (request, response) => {
  let url = auth.getAuthorizeUrl()
  response.format({
    'text/html': function() {
      response.send('"<html><body><h3>Please click <a href="' +
      url +
      '"> HERE </a>' +
      ' and follow next steps to get access token</h3></body></html>')
    }
  })
}


/**
 * Displays the token or error received from Auth0.
 * @param{String} request - request object
 * @param{String} response - response object
 */
export const showToken = (request, response) => {
  let authObject = qs.parse(request.body)
  let token = (authObject.error) ? authObject.error_description : 'Token:' +
  authObject.access_token
  response.format({
    'text/html': function() {
      response.send('<html><body><h3>' + token + '</h3></body></html>')
    }
  })
}

/**
 * Returns object with all request parameters
 * @param{String} request - request object
 * @return {object} params all request parameters
 */
export const getParams = (request) => {
  let params = {}
  Object.keys(request.swagger.params).forEach(property => {
    params[property] = request.swagger.params[property].value
  })
  return params
}
