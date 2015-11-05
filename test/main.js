import test from 'tape';
import Collection from '../bin/ampersand-jsonapi-collection';


// NOTE: this module simply pulls together other modules, the tests are
// intentionally light here because it doesn't do much.

test('existance of fetch methods basic functionality etc.', function(t) {
  const Coll = Collection.extend({
    url: '/test',
  });
  const c = new Coll();
  t.ok(c);
  c.fetch();
  t.ok(c.each);
  t.end();
});

test('existance of lodash methods', function(t) {
  const c = new Collection();
  t.ok(c.find);
  t.ok(c.filter);
  t.end();
});
