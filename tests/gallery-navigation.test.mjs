import assert from 'node:assert/strict';
import { test } from 'node:test';
import { galleryScrollTarget } from '../lib/galleryNavigation.ts';

test('previous leaves the scroll end when several images fit together', () => {
  assert.equal(galleryScrollTarget([4, 204, 404, 604, 804], 500, 500, -1), 400);
});
test('next advances to distinct reachable image positions', () => {
  assert.equal(galleryScrollTarget([4, 204, 404, 604, 804], 400, 500, 1), 500);
});
test('bounds and an all-visible gallery remain stable', () => {
  assert.equal(galleryScrollTarget([4, 204], 0, 0, 1), 0);
  assert.equal(galleryScrollTarget([4, 204], 0, 100, -1), 0);
  assert.equal(galleryScrollTarget([4, 204], 100, 100, 1), 100);
});
test('first Next skips the first image including strip padding', () => {
  assert.equal(galleryScrollTarget([4, 204, 404], 0, 300, 1), 200);
});
