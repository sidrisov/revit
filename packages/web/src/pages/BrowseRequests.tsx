import React, { useState } from 'react';
import { useStore, type Request } from '../store/useStore';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import StatusBadge from '../components/StatusBadge';
import RequestDetail from './RequestDetail';
import { Search, FileText, DollarSign, MessageSquare, Eye, Target } from 'lucide-react';

const BrowseRequests: React.FC = () => {
  const allRequests = useStore((s) => s.requests);
  const requests = allRequests.filter((r) => r.status === 'active');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  if (selectedRequest) {
    return (
      <RequestDetail
        request={selectedRequest}
        onBack={() => setSelectedRequest(null)}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-6 sm:mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-blue-400 rounded-3xl mb-4 sm:mb-6 shadow-xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
          <Search className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-slate-800 mb-3 sm:mb-4 transform -rotate-1">Browse Requests! 🔍</h2>
        <p className="text-lg sm:text-xl text-slate-600 font-semibold px-4">Find projects that need your expertise and earn rewards! 💰</p>
      </div>
      
      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center shadow-2xl border-4 border-blue-300">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-blue-400 rounded-full mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
            <Target className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mb-3 sm:mb-4">No Active Requests! 😔</h3>
          <p className="text-slate-600 text-lg sm:text-xl font-semibold px-4">Be the first to create a feedback request! 🚀</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {requests.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border-4 border-blue-200 cursor-pointer hover:shadow-2xl hover:transform hover:-translate-y-2 hover:border-blue-400 transition-all duration-300 group"
              onClick={() => setSelectedRequest(r)}
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-400 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-300">
                    <FileText className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg sm:text-xl text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {r.title}
                    </h4>
                  </div>
                </div>
              </div>
              
              <p className="text-slate-600 mb-4 sm:mb-6 line-clamp-3 leading-relaxed font-medium text-sm sm:text-base">
                {r.description}
              </p>
              
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="bg-green-100 border-2 border-green-300 text-green-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1 sm:gap-2">
                  <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                  💰 ${r.reward}
                </div>
                <div className="bg-orange-100 border-2 border-orange-300 text-orange-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1 sm:gap-2">
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                  💬 {r.responses.length}
                </div>
              </div>
              
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black transition-all duration-300 group-hover:transform group-hover:scale-105 shadow-xl flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                👀 View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseRequests;
