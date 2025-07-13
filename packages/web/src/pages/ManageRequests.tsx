import React, { useState } from 'react';
import { useStore, type Request, type Response } from '../store/useStore';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import StatusBadge from '../components/StatusBadge';
import { toast } from 'sonner';
import { BarChart3, FileText, MessageSquare, DollarSign, User, Clock, Gift, Send, CheckCircle2, Clipboard } from 'lucide-react';

const demoUser = 'demoUser';

const ManageRequests: React.FC = () => {
  const allRequests = useStore((s) => s.requests);
  const requests = allRequests.filter((r) => r.creator === demoUser);
  const [selectedBonuses, setSelectedBonuses] = useState<{
    [requestId: string]: string[];
  }>({});

  const handleSelectBonus = (requestId: string, responseId: string) => {
    setSelectedBonuses((prev) => {
      const current = prev[requestId] || [];
      return {
        ...prev,
        [requestId]: current.includes(responseId)
          ? current.filter((id) => id !== responseId)
          : [...current, responseId],
      };
    });
  };

  const handleProcessPayments = () => {
    toast.success('Payments processed!', {
      description: 'All payments have been processed.',
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl mb-4 shadow-lg">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">Manage Your Requests</h2>
        <p className="text-lg text-slate-600">Review responses and process payments for your feedback requests</p>
      </div>
      
      {requests.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-12 text-center shadow-2xl border border-white/20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl mb-6">
            <Clipboard className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-3">No Requests Yet</h3>
          <p className="text-slate-600 text-lg">Create your first feedback request to get started!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">{req.title}</h3>
                    <p className="text-slate-600 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      {req.responses.length} responses received
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    ${req.reward} deposit
                  </div>
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Active
                  </div>
                </div>
              </div>
              {req.responses.length === 0 ? (
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 text-center border border-slate-200">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl mb-4">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-slate-600 font-semibold">Waiting for responses...</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                      <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      Feedback Responses
                    </h4>
                    <div className="space-y-4">
                      {req.responses.map((resp: Response) => (
                        <div key={resp.id} className="bg-[#f8f9fa] rounded-xl p-6 border border-[#e0e0e0]">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#667eea] rounded-full flex items-center justify-center text-white font-bold">
                                {resp.contributor[0].toUpperCase()}
                              </div>
                              <div>
                                <span className="font-semibold text-[#222]">@{resp.contributor}</span>
                                <div className="text-sm text-[#555]">Score: {resp.score || 'Pending'}</div>
                              </div>
                            </div>
                            <button
                              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                selectedBonuses[req.id]?.includes(resp.id)
                                  ? 'bg-green-500 hover:bg-green-600 text-white'
                                  : 'bg-white hover:bg-[#667eea] hover:text-white text-[#667eea] border border-[#667eea]'
                              }`}
                              onClick={() => handleSelectBonus(req.id, resp.id)}
                            >
                              {selectedBonuses[req.id]?.includes(resp.id) ? '✅ Selected' : '🎁 Select for Bonus'}
                            </button>
                          </div>
                          <div className="space-y-3">
                            {resp.answers.map((a, i) => (
                              <div key={i} className="bg-white rounded-lg p-4">
                                <div className="font-medium text-[#222] mb-2">Question {i + 1}</div>
                                <div className="text-[#555]">{a}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-[#f8f9fa] rounded-xl p-6 border border-[#e0e0e0]">
                    <h4 className="text-lg font-bold text-[#222] mb-4 flex items-center gap-2">
                      <span className="text-xl">💰</span>
                      Payment Summary
                    </h4>
                    <div className="space-y-2 mb-6 text-[#555]">
                      <div className="flex justify-between">
                        <span>Base Payments ({req.responses.length} responses):</span>
                        <span className="font-semibold">${req.reward * req.responses.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bonus Payments ({selectedBonuses[req.id]?.length || 0} selected):</span>
                        <span className="font-semibold">${(selectedBonuses[req.id]?.length || 0) * 10}</span>
                      </div>
                      <hr className="border-[#e0e0e0]" />
                      <div className="flex justify-between text-lg font-bold text-[#222]">
                        <span>Total Cost:</span>
                        <span>${req.reward * req.responses.length + (selectedBonuses[req.id]?.length || 0) * 10}</span>
                      </div>
                    </div>
                    <button
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-bold rounded-xl transition-all duration-300 hover:transform hover:-translate-y-0.5 shadow-lg"
                      onClick={handleProcessPayments}
                    >
                      🚀 Process All Payments
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageRequests;
