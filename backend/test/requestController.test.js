const test = require('node:test');
const assert = require('node:assert/strict');

test('request controller can be required without module resolution errors', () => {
  const requestController = require('../src/controller/request');

  assert.ok(requestController.sendConnectionRequest);
});

test('request router exposes send and review endpoints', () => {
  const requestRouter = require('../src/router/request');
  const paths = requestRouter.stack
    .filter((layer) => layer.route)
    .map((layer) => layer.route.path);

  assert.ok(paths.includes('/send/:status/:id'));
  assert.ok(paths.includes('/sand/:status/:id'));
  assert.ok(paths.includes('/review/:status/:id'));
});
