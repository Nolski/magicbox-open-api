// import util from 'util'
// import general_helper from '../helpers/general'

var util = require('util');
var general_helper = require('../helpers/general');

/**
 * Return list of countries with aggregated population data
 * @param{String} request - request object
 * @param{String} res - response object
 * @return{Promise} Fulfilled when records are returned
 */
function general(req, res) {
  const data_kind = req._key || req.swagger.params.kind.value
  // Fetch array of countries and metadata about population aggregations.
  // Example: {"afg":{"popmap15adj":[{"gadm2-8":2}]},"ago":{"AGO15adjv4":[{"gadm2-8":3}]}
  general_helper
    .countries_with_this_kind_data(data_kind)
    .then(data => res.json({
      data_kind: data_kind,
      data: data
    }))
    .catch(err =>
      res.json({message: err})
    )
}


/**
 * Returns an object with information about cases for specific kind in all countries
 * @param{String} request - request object
 * @param{String} res - response object
 * @return{Promise} Fulfilled when records are returned
 */
function getCases(request, response) {
  // key represents what data we want to pull, here it is 'cases'
  const key = request._key
  // kind represents disease whose cases we are pulling
  const kind = request.swagger.params.kind.value
  // week types (epi-week or iso-week)
  const weekType = request.swagger.params.weekType.value
  // week represents last date of epi-week. If set, the API will fetch cases only for that week
  const week = request.swagger.params.date ? request.swagger.params.date.value : null

  general_helper
    .get_cases(key, kind, weekType, week)
    .then((cases) => response.json({
      kind: kind,
      weekType: weekType,
      cases: cases
    }))
    .catch(error =>
      response.json({ message: error })
    )

}

/**
 * Returns population of each admin for specified country.
 * @param{String} request - request object
 * @param{String} res - response object
 * @return{Promise} Fulfilled when records are returned
 */
function getPopulationByCountry(request, response) {
  // country represents country whose population we are pulling
  const country = request._key

  general_helper
    .get_population_by_admins('population', country)
    .then(population_map => response.json({
      country: country,
      source: population_map.source,
      raster: population_map.raster,
      population: population_map.population
    }))
    .catch(error =>
      response.json({ message: error })
    )
}

module.exports = {
  getPopulationByCountry: getPopulationByCountry,
  general: general,
  getCases: getCases
};
