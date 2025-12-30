
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase'; // Assuming there is a supabase client instance

interface VoicePlayerProps {
    storyId: string;
    sceneIndex: number;
    text: string;
}

type AudioStatus = 'idle' | 'pending' | 'transporting' | 'success' | 'failed' | 'playing';

export const VoicePlayer: React.FC<VoicePlayerProps> = ({ storyId, sceneIndex, text }) => {
    const [status, setStatus] = useState<AudioStatus>('idle');
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);
    const pollIntervalRef = React.useRef<number | null>(null);

    // 1. Initial Check
    useEffect(() => {
        checkStatus();
        return () => stopPolling();
    }, [storyId, sceneIndex]);

    const stopPolling = () => {
        if (pollIntervalRef.current) {
            window.clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
        }
    };

    const checkStatus = async () => {
        try {
            const { data, error } = await supabase.functions.invoke('check-narration-status', {
                body: { story_id: storyId, scene_index: sceneIndex }
            });

            if (error) {
                // If 404/not found, it means we haven't started yet, so idle. 
                // But our function throws error if not found.
                // We might need to handle that gracefully.
                console.log('Check status error (likely not created yet):', error);
                setStatus('idle');
                return;
            }

            if (data.status === 'success') {
                setAudioUrl(data.audio_url);
                setStatus('success');
            } else if (data.status === 'pending') {
                setStatus('pending');
                startPolling();
            } else if (data.status === 'failed') {
                setStatus('failed');
            }
        } catch (err) {
            console.error(err);
            setStatus('idle');
        }
    };

    const startPolling = () => {
        stopPolling();
        pollIntervalRef.current = window.setInterval(async () => {
            const { data, error } = await supabase.functions.invoke('check-narration-status', {
                body: { story_id: storyId, scene_index: sceneIndex }
            });

            if (data?.status === 'success') {
                stopPolling();
                setAudioUrl(data.audio_url);
                setStatus('success');
                // Auto play when ready? Maybe better to let user click play.
            } else if (data?.status === 'failed') {
                stopPolling();
                setStatus('failed');
            }
        }, 10000); // Poll every 10s
    };

    const handlePlayClick = async () => {
        if (status === 'success' && audioUrl) {
            if (audioRef.current) {
                audioRef.current.play();
                setIsPlaying(true);
            }
            return;
        }

        if (status === 'idle' || status === 'failed') {
            setStatus('pending');
            try {
                const { data, error } = await supabase.functions.invoke('request-narration', {
                    body: { story_id: storyId, scene_index: sceneIndex, text }
                });

                if (error) throw error;

                if (data.status === 'success') {
                    setAudioUrl(data.audio_url);
                    setStatus('success');
                } else {
                    startPolling();
                }
            } catch (err) {
                console.error('Request narration failed:', err);
                setStatus('failed');
            }
        }
    };

    const handleAudioEnded = () => {
        setIsPlaying(false);
    };

    return (
        <div className="voice-player-container">
            {audioUrl && (
                <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={handleAudioEnded}
                    onPause={() => setIsPlaying(false)}
                    onPlay={() => setIsPlaying(true)}
                />
            )}

            <button
                onClick={status === 'success' && isPlaying ? () => audioRef.current?.pause() : handlePlayClick}
                disabled={status === 'pending'}
                className={`voice-btn ${status}`}
                style={{
                    opacity: status === 'pending' ? 0.7 : 1,
                    cursor: status === 'pending' ? 'wait' : 'pointer'
                }}
            >
                {status === 'idle' && '🔊 朗读'}
                {status === 'pending' && '⏳ 生成中 (约1分钟)...'}
                {status === 'failed' && '❌ 重试'}
                {status === 'success' && !isPlaying && '▶️ 播放'}
                {status === 'success' && isPlaying && '⏸️ 暂停'}
            </button>
        </div>
    );
};
