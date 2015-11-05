'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ampersandJsonapiAjaxconfig = require('ampersand-jsonapi-ajaxconfig');

var _ampersandJsonapiAjaxconfig2 = _interopRequireDefault(_ampersandJsonapiAjaxconfig);

var _ampersandRestCollection = require('ampersand-rest-collection');

var _ampersandRestCollection2 = _interopRequireDefault(_ampersandRestCollection);

var _lodash = require('lodash.assign');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isarray');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.map');

var _lodash6 = _interopRequireDefault(_lodash5);

var _lodash7 = require('lodash.where');

var _lodash8 = _interopRequireDefault(_lodash7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates a new JSONAPI Collection. Models in this collection should be
 * JSONAPIModels.
 * @constructor
 * @alias JSONAPICollection
 * @see JSONAPIModel
 * @requires AmpersandRestCollection
 * @requires lodash.assign
 * @requires lodash.isArray
 * @requires lodash.map
 * @requires lodash.where
 * @requires module:config
 * @requires module:mixins/http-bearer-auth
 * @extends AmpersandRestCollection
 * @mixes ajaxConfig
 * @argument {Array} models   - The initial array of models to set as
 *                              the collection.
 * @argument {Object} options - The set of options to be used by
 *                              AmpersandRestCollection
 */
/**
 * @file {@link JSONAPICollection} module: a base collection extending
 * AmpersandRestCollection that parses data received from
 * [JSONAPI](http://jsonapi.org/)-compatible servers.
 * @module classes/json-api-collection
 * @see JSONAPICollection
 * @see module:classes/json-api-model
 */

var JSONAPICollection = _ampersandRestCollection2.default.extend(_ampersandJsonapiAjaxconfig2.default, {

  /**
   * Parses the server response into a format which Ampersand
   * Collections expect. Called when collection is initialized.
   * @method parse
   * @memberof JSONAPICollection
   * @instance
   * @override
   * @param {Object} response - The response received from the server.
   * @returns {Object} The transformed response.
   */

  parse: function parse(response) {

    /** The array of data from the JSONAPI response. */
    var resources = response.data ? response.data : response;

    /** The included relations from the JSONAPI response. */
    var included = response.included;

    /**
     * Matches the JSONAPI relationship link to the included relations.
     * @function matchIncluded
     * @memberof JSONAPICollection#parse
     * @param {Object} link - The type and id of the included resource.
     * @returns {Object} The resource corresponding to the type and id
     *                   in the link.
     * @private
     */
    function matchIncluded(link) {
      return (0, _lodash8.default)(included, link)[0];
    }

    if (included) {

      resources.forEach(function (resource) {

        /** The relationships of this particular resource (model) */
        var relationships = resource.relationships;

        for (var rel in relationships) {

          // If there is a data property, there will be an included resource.
          if (relationships[rel].data) {

            // If the data is an array, this property needs to be an array
            if ((0, _lodash4.default)(relationships[rel].data)) {
              var newCollection = (0, _lodash6.default)(relationships[rel].data, matchIncluded);

              // We're going to need this included property in order to
              // nest relationships of child collections.
              newCollection.included = included;

              resource.attributes[rel] = newCollection;
            } else {
              resource.attributes[rel] = matchIncluded(relationships[rel].data);
            }
          }
        }
      });
    }

    return resources;
  },

  /**
   * Serializes the collection into a format which the JSON-API server
   * expects.
   * @method serialize
   * @memberof JSONAPICollection
   * @instance
   * @override
   * @returns {Object} The JSON-API-formatted collection.
   */
  serialize: function serialize() {
    return {
      data: this.map(function (model) {
        if (model.serialize) {
          return model.serialize();
        }

        var out = {};
        (0, _lodash2.default)(out, model);
        delete out.collection;
        return out;
      })
    };
  }
});

exports.default = JSONAPICollection;
