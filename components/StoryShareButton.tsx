import React, { useState } from 'react';
import type { ShareExportProgress } from '../services/shareStory';
import { STORY_SHARE_BUTTON_PRESENTATION } from './storyShareButtonPresentation';

interface StoryShareButtonProps {
  onExport: (onProgress: (progress: ShareExportProgress) => void) => Promise<number>;
}

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={STORY_SHARE_BUTTON_PRESENTATION.iconClassName} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.11.343.245.486.401m-.486-.401 9.566-5.476m-9.08 7.662c-.143.156-.306.291-.486.401m.486-.401 9.566 5.476m0 0a2.25 2.25 0 1 0 3.073.823 2.25 2.25 0 0 0-3.073-.823Zm0-13.138a2.25 2.25 0 1 0 3.073-.823 2.25 2.25 0 0 0-3.073.823Z" />
  </svg>
);

const StoryShareButton: React.FC<StoryShareButtonProps> = ({ onExport }) => {
  const [progress, setProgress] = useState<ShareExportProgress | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (progress) return;

    setError(null);
    setResult(null);
    setProgress({ current: 0, total: 1, message: '正在读取故事' });

    try {
      const count = await onExport(setProgress);
      setProgress(null);
      setResult(`已生成 ${count} 张分享图`);
      window.setTimeout(() => setResult(null), 3600);
    } catch (reason) {
      console.error('导出分享图失败', reason);
      setProgress(null);
      setError(reason instanceof Error ? reason.message : '导出失败，请稍后再试');
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleExport}
        className={STORY_SHARE_BUTTON_PRESENTATION.buttonClassName}
        aria-label={STORY_SHARE_BUTTON_PRESENTATION.ariaLabel}
        title={STORY_SHARE_BUTTON_PRESENTATION.title}
      >
        <ShareIcon />
      </button>

      {progress && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-900/55 px-6 backdrop-blur-sm" onClick={event => event.stopPropagation()}>
          <div className="w-full max-w-sm rounded-xl border border-ink-800/15 bg-paper-50 p-7 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-accent-red text-paper-50">
              <ShareIcon />
            </div>
            <h3 className="mb-2 text-xl font-bold text-ink-900">正在制作小红书分享图</h3>
            <p className="mb-5 text-sm text-ink-500">{progress.message}</p>
            <div className="h-2 overflow-hidden rounded-full bg-paper-300">
              <div
                className="h-full rounded-full bg-accent-red transition-all duration-300"
                style={{ width: `${Math.max(5, (progress.current / progress.total) * 100)}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-ink-500">{progress.current} / {progress.total}</p>
          </div>
        </div>
      )}

      {(result || error) && (
        <div
          className={`fixed bottom-8 left-1/2 z-[110] -translate-x-1/2 rounded-full px-5 py-3 text-sm font-bold text-white shadow-xl ${error ? 'bg-accent-red' : 'bg-ink-900'}`}
          role="status"
          onClick={event => event.stopPropagation()}
        >
          {error || result}
        </div>
      )}
    </>
  );
};

export default StoryShareButton;
