import React from 'react';
import { Dialog, DialogContent } from 'shadcn-ui';

const OnboardingModal: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-w-md mx-auto p-8 text-center">
      <h2 className="text-xl font-bold mb-2">Welcome to Revit! 🎉</h2>
      <p className="mb-4 text-gray-600">
        Your new way to request, give, and manage feedback on Farcaster
      </p>
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎤</span>
          <span>
            Easy Feedback Requests: Describe your needs by voice or text, and
            let AI generate questions for you.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-2xl">💰</span>
          <span>
            Earn & Reward: Contributors earn crypto for quality feedback. Reward
            the best responses!
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <span>
            AI-Powered Insights: AI summarizes and scores responses to help you
            choose the best feedback.
          </span>
        </div>
      </div>
      <button className="btn btn-primary w-full mt-4" onClick={onClose}>
        Get Started
      </button>
    </DialogContent>
  </Dialog>
);

export default OnboardingModal;
