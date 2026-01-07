import React, { useState } from 'react';
import { supabase } from '../services/supabase';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
    const [content, setContent] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const { error } = await supabase
                .from('feedback')
                .insert([
                    {
                        content,
                        contact_info: contactInfo,
                        device_info: {
                            userAgent: navigator.userAgent,
                            platform: navigator.platform,
                            language: navigator.language,
                            screenWidth: window.screen.width,
                            screenHeight: window.screen.height,
                            windowWidth: window.innerWidth,
                            windowHeight: window.innerHeight,
                        }
                    }
                ]);

            if (error) throw error;

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setContent('');
                setContactInfo('');
                onClose();
            }, 2000);
        } catch (err) {
            console.error('Feedback error:', err);
            setError('提交失败，请稍后再试');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-paper-100 w-full max-w-md rounded-lg shadow-xl border-2 border-ink-800 p-6 relative" onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-ink-500 hover:text-red-700 transition-colors"
                    title="关闭"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-serif font-bold text-ink-900 mb-4">意见反馈</h2>

                {success ? (
                    <div className="text-center py-8">
                        <div className="flex justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-green-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </div>
                        <div className="text-green-600 text-xl font-bold mb-2">感谢您的反馈！</div>
                        <p className="text-ink-600">我们会认真阅读您的建议。</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="feedback-content" className="block text-sm font-bold text-ink-800 mb-1">
                                您的建议或问题 <span className="text-red-600">*</span>
                            </label>
                            <textarea
                                id="feedback-content"
                                rows={4}
                                className="w-full px-3 py-2 bg-paper-50 border border-ink-300 rounded focus:border-ink-900 focus:outline-none transition-colors"
                                placeholder="请详细描述您遇到的问题或建议..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="contact-info" className="block text-sm font-bold text-ink-800 mb-1">
                                联系方式 (选填)
                            </label>
                            <input
                                type="text"
                                id="contact-info"
                                className="w-full px-3 py-2 bg-paper-50 border border-ink-300 rounded focus:border-ink-900 focus:outline-none transition-colors"
                                placeholder="邮箱或手机号，方便我们联系您"
                                value={contactInfo}
                                onChange={(e) => setContactInfo(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="text-red-600 text-sm">{error}</div>
                        )}

                        <div className="flex justify-end pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-ink-600 hover:text-ink-900 mr-2 rounded hover:bg-black/5 transition-colors"
                                disabled={isSubmitting}
                            >
                                取消
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-ink-900 text-white rounded hover:bg-ink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                                disabled={isSubmitting || !content.trim()}
                            >
                                {isSubmitting ? '提交中...' : '提交'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default FeedbackModal;
