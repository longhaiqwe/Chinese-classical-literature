import assert from 'node:assert/strict';
import test from 'node:test';
import * as shareTransport from './shareTransport.ts';

const { chooseShareTransport } = shareTransport;

test('Android 多图使用明确 image/png 的原生分享桥接', () => {
  assert.equal(chooseShareTransport('android', 7), 'android-images');
});

test('iOS 继续使用 Capacitor 多图分享，网页继续下载 ZIP', () => {
  assert.equal(chooseShareTransport('ios', 7), 'capacitor');
  assert.equal(chooseShareTransport('web', 7), 'web-zip');
});

test('分享给小红书时自动带上故事标题和开篇背景', () => {
  assert.equal(typeof shareTransport.buildStoryShareMetadata, 'function');
  assert.deepEqual(
    shareTransport.buildStoryShareMetadata('三打白骨精', '  孙悟空保护师父，一次次识破白骨精的变化。  '),
    {
      title: '中国故事：三打白骨精',
      text: '孙悟空保护师父，一次次识破白骨精的变化。',
      clipboardText: '中国故事：三打白骨精\n\n孙悟空保护师父，一次次识破白骨精的变化。',
      dialogTitle: '分享整套故事图片',
    },
  );
});

test('iOS 和 Android 原生分享前都复制备用文案，网页导出不碰剪贴板', () => {
  assert.equal(typeof shareTransport.shouldCopyStoryShareMetadata, 'function');
  assert.equal(shareTransport.shouldCopyStoryShareMetadata('android'), true);
  assert.equal(shareTransport.shouldCopyStoryShareMetadata('ios'), true);
  assert.equal(shareTransport.shouldCopyStoryShareMetadata('web'), false);
});
