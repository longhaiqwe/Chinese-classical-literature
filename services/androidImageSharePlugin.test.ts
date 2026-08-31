import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const pluginSource = readFileSync(
  new URL('../android/app/src/main/java/com/peachgarden/app/ImageSharePlugin.java', import.meta.url),
  'utf8',
);

test('Android 分享面板交接完成后立即成功，不把目标 App 的 RESULT_CANCELED 当作失败', () => {
  assert.doesNotMatch(pluginSource, /startActivityForResult/);
  assert.doesNotMatch(pluginSource, /Share canceled/);
  assert.match(pluginSource, /getActivity\(\)\.startActivity\(chooser\);\s*call\.resolve/);
});
