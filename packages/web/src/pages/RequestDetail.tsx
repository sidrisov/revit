import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import StatusBadge from '../components/StatusBadge';
import { toast } from 'sonner';

const RequestDetail: React.FC<{ request?: any; onBack?: () => void }> = ({
  request: propRequest,
  onBack,
}) => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const request =
    propRequest ||
    useStore((s) => s.requests.find((r) => r.id === (params.id || '')));
  const setRequests = useStore((s) => s.setRequests);
  const [answers, setAnswers] = useState<string[]>(
    request?.questions.map(() => '') || []
  );
  const [submitted, setSubmitted] = useState(false);

  if (!request)
    return (
      <Card className="max-w-xl mx-auto my-10 p-8 text-center text-gray-400">
        Request not found.
      </Card>
    );

  const handleChange = (idx: number, value: string) => {
    setAnswers((a) => a.map((ans, i) => (i === idx ? value : ans)));
  };

  const handleSubmit = () => {
    if (answers.some((a) => !a.trim())) return;
    setRequests(
      useStore.getState().requests.map((r) =>
        r.id === request.id
          ? {
              ...r,
              responses: [
                ...r.responses,
                {
                  id: (r.responses.length + 1).toString(),
                  contributor: 'demoContributor',
                  answers: [...answers],
                  score: 0,
                  selected: false,
                },
              ],
            }
          : r
      )
    );
    setSubmitted(true);
    toast.success('Feedback submitted!', {
      description: 'Thank you for your response.',
    });
  };

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <div className="max-w-2xl mx-auto my-10 md:mt-12 px-2">
      <div className="flex items-center gap-3 mb-4 mt-2">
        <Button variant="outline" onClick={handleBack} className="px-3 py-1">
          <span className="mr-1">←</span>Back
        </Button>
        <span className="text-2xl">📝</span>
        <h2 className="text-2xl font-bold">Request Details</h2>
        <StatusBadge type="info">${request.reward} reward</StatusBadge>
        <StatusBadge type="pending">
          {request.responses.length} responses
        </StatusBadge>
      </div>
      <Card className="p-6 shadow-md hover:shadow-lg transition-shadow duration-300 animate-fade-in bg-white">
        <h3 className="font-semibold text-lg mb-2">{request.title}</h3>
        <div className="mb-4 text-gray-700">{request.description}</div>
        {request.audioUrl && (
          <audio src={request.audioUrl} controls className="mb-4 w-full" />
        )}
        <h4 className="font-semibold mb-2">Questions</h4>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}>
          {request.questions.map((q: string, i: number) => (
            <div key={i} className="mb-4">
              <label className="block mb-1 font-medium">
                {i + 1}. {q}
              </label>
              <textarea
                value={answers[i]}
                onChange={(e) => handleChange(i, e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
                style={{ minHeight: 60 }}
              />
            </div>
          ))}
          {!submitted ? (
            <Button
              type="submit"
              className="w-full mt-2 transition-transform duration-150 active:scale-95">
              Submit Feedback
            </Button>
          ) : (
            <div className="bg-green-100 text-green-800 p-3 rounded mt-4 text-center">
              ✅ Response submitted!
            </div>
          )}
        </form>
      </Card>
    </div>
  );
};

export default RequestDetail;
