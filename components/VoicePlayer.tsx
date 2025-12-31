
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

    // Initial Check - try to get existing audio URL
    useEffect(() => {
        checkStatus();
    }, [storyId, sceneIndex]);

    const checkStatus = async () => {
        try {
            // We assume audio is pre-generated. 
            // We check status mainly to get the URL if it exists.
            const { data, error } = await supabase.functions.invoke('check-narration-status', {
                body: { story_id: storyId, scene_index: sceneIndex }
            });

            if (error) {
                // Determine if it's a 404 or other error. 
                // For now, if error, we set to idle/failed.
                console.log('Check status error:', error);
                setStatus('idle');
                return;
            }

            if (data.status === 'success') {
                setAudioUrl(data.audio_url);
                setStatus('success');
            } else {
                // If pending or failed, we just show as unavailable for now in this pre-gen model
                setStatus('idle');
            }
        } catch (err) {
            console.error(err);
            setStatus('idle');
        }
    };

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
    };

    const handleAudioEnded = () => {
        setIsPlaying(false);
    };

    if (status !== 'success' || !audioUrl) {
        // Option: Don't render anything if no audio, or render a disabled "No Audio" button/icon
        // For better UX in pre-gen model, we might just hide it if not ready.
        // Or show a disabled button.
        return null;
    }

    return (
        <div className="voice-player-container">
            <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={handleAudioEnded}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
            />

            <button
                onClick={togglePlay}
                className="voice-btn success"
                style={{ cursor: 'pointer' }}
                title="播放"
            >
                {isPlaying ? '⏸️ 暂停' : '▶️ 播放'}
            </button>
        </div>
    );
};
