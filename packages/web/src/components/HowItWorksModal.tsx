import React from 'react';
import { Dialog, DialogContent } from 'shadcn-ui';

const HowItWorksModal: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-w-md mx-auto p-8 text-center">
      <h2 className="text-xl font-bold mb-2">How It Works?</h2>
      <p className="mb-4 text-gray-600">
        A quick guide to requesting and giving feedback on Revit
      </p>
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📝</span>
          <span>
            Request Feedback: Describe your needs (voice or text), set a
            deposit, and publish your request. AI generates a questionnaire for
            you.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔍</span>
          <span>
            Contributors Respond: Others browse requests, answer your questions,
            and submit feedback to earn rewards.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <span>
            AI-Powered Review: AI summarizes and scores responses, helping you
            select the best feedback and distribute bonuses.
          </span>
        </div>
      </div>
      <button className="btn btn-primary w-full mt-4" onClick={onClose}>
        Got it!
      </button>
    </DialogContent>
  </Dialog>
);

export default HowItWorksModal;
