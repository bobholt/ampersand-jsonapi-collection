# ampersand-jsonapi-collection

AmpersandJSONAPICollection is a [JSON-API](http://jsonapi.org/)-compatible
extension of the
[AmpersandJS REST Collection](https://github.com/AmpersandJS/ampersand-rest-collection).

It achieves this JSON-API compatibility by overriding select methods within
ampersand-rest-collection and adding appropriate HTTP headers to requests.

## Installing

```
npm install ampersand-jsonapi-collection
```

## API Reference

Except as described below, AmpersandJSONAPICollection has the same interface as
[AmpersandRestCollection](https://github.com/AmpersandJS/ampersand-rest-collection)
and [AmpersandState](https://github.com/AmpersandJS/ampersand-state).

To ensure this, AmpersandJSONAPICollection passes all tests for
AmpersandRestCollection (version 5.0.0).

The following methods have been overridden:

### parse model.parse(data)

This has been augmented to parse JSON-API formatted data: specifically a
format in which model attributes are nested within the structure
`{ data: [ { attributes: {} } ] }`.

### serialize model.serialize()

This has been augmented in order to serialize data into the correct format
expected by JSON-API.
