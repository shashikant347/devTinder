const test = require('node:test');
const assert = require('node:assert/strict');

test('request controller can be required without module resolution errors', () => {
  const requestController = require('../src/controller/request');

  assert.ok(requestController.sendConnectionRequest);
});
