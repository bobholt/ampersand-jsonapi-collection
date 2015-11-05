/**
 * @file {@link JSONAPICollection} module: a base collection extending
 * AmpersandRestCollection that parses data received from
 * [JSONAPI](http://jsonapi.org/)-compatible servers.
 * @module classes/json-api-collection
 * @see JSONAPICollection
 * @see module:classes/json-api-model
 */

import ajaxConfig from 'ampersand-jsonapi-ajaxconfig';
import AmpersandRestCollection from 'ampersand-rest-collection';
import assign from 'lodash.assign';
import isArray from 'lodash.isarray';
import map from 'lodash.map';
import where from 'lodash.where';

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
const JSONAPICollection = AmpersandRestCollection.extend(ajaxConfig, {

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
  parse(response) {

    /** The array of data from the JSONAPI response. */
    const resources = response.data ? response.data : response;

    /** The included relations from the JSONAPI response. */
    const included = response.included;

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
      return where(included, link)[0];
    }

    if (included) {

      resources.forEach(function(resource) {

        /** The relationships of this particular resource (model) */
        const relationships = resource.relationships;

        for (const rel in relationships) {

          // If there is a data property, there will be an included resource.
          if (relationships[rel].data) {

            // If the data is an array, this property needs to be an array
            if (isArray(relationships[rel].data)) {
              const newCollection = map(
                relationships[rel].data,
                matchIncluded
              );

              // We're going to need this included property in order to
              // nest relationships of child collections.
              newCollection.included = included;

              resource.attributes[rel] = newCollection;
            }
            else {
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
  serialize() {
    return {
      data: this.map(function(model) {
        if (model.serialize) {
          return model.serialize();
        }

        const out = {};
        assign(out, model);
        delete out.collection;
        return out;
      }),
    };
  },
});

export default JSONAPICollection;
