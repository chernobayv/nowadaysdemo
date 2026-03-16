import { useState } from 'react';
import imgImage4 from "figma:asset/9ecff5025de3d6deb397789c734c9c0078063c9e.png";

const eventTypeOptions = [
  "Team Offsite",
  "Exec Dinner",
  "All-Hands",
  "Product Launch",
  "Sales Kickoff",
  "Leadership Retreat",
  "Holiday Party",
  "Team Building",
  "Client Event",
  "Conference",
  "Workshop",
  "Training Session",
  "Networking Event",
  "Awards Ceremony",
  "Quarterly Review"
];

const guestTypeOptions = [
  "Internal team",
  "Executive leadership",
  "Clients & partners",
  "Board members",
  "Investors",
  "Vendors & suppliers",
  "Industry peers",
  "Media & press",
  "Job candidates",
  "Alumni & former employees",
  "Cross-functional teams",
  "External consultants"
];

export default function App() {
  const [eventType, setEventType] = useState('');
  const [guestType, setGuestType] = useState('');
  const [budget, setBudget] = useState('');
  const [goals, setGoals] = useState('');
  const [eventTypeOpen, setEventTypeOpen] = useState(false);
  const [guestTypeOpen, setGuestTypeOpen] = useState(false);

  return (
    <div className="relative size-full overflow-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1527 1440">
          <defs>
            <radialGradient cx="0" cy="0" gradientTransform="matrix(1284.59 -1232 1306.43 841.25 80.1675 169)" gradientUnits="userSpaceOnUse" id="paint0_radial" r="1">
              <stop stopColor="#e9d5f0" stopOpacity="0.3" />
              <stop offset="0.588369" stopColor="#fef8fb" />
              <stop offset="1" stopColor="#c5d9e8" stopOpacity="0.3" />
            </radialGradient>
          </defs>
          <path d="M0 0H1527V1440H0V0Z" fill="url(#paint0_radial)" />
        </svg>
      </div>

      {/* Title Bar */}
      <div className="relative bg-[#fdfcfe] h-[69px] border-b border-gray-100">
        <div className="flex items-center h-full px-[30px]">
          <img alt="nowadays logo" className="size-[45px] object-cover" src={imgImage4} />
          <p className="ml-[17px] text-[20px] font-medium text-[#1e1e1e]">
            nowadays
          </p>
        </div>
      </div>

      {/* Header Text */}
      <div className="relative mt-[52px] text-center">
        <h1 className="text-[64px] font-semibold text-[#1c1c1e] tracking-[-2.56px] leading-none">
          Event Approval Planner
        </h1>
        <p className="mt-[30px] text-[24px] font-medium text-[#6b7280] tracking-[-0.96px]">
          From idea to sign-off in 60 seconds
        </p>
        <p className="mt-[32px] mx-auto max-w-[794px] text-[16px] text-[#6b7280] tracking-[-0.64px] leading-normal px-4">
          Get a complete ready-to-send exec memo, <span className="font-semibold">all in one place</span>. No spreadsheets, no back-and-forth. Just the numbers you need to get approved and start planning.
        </p>
      </div>

      {/* Form Card */}
      <div className="relative mx-auto mt-[62px] mb-[100px] w-full max-w-[1193px] px-4">
        <div className="bg-white border border-[#d1d5db] rounded-[20px] p-[68px_68px_54px_68px] shadow-sm">
          <h2 className="text-[20px] font-medium text-black tracking-[-0.8px] mb-[43px]">
            Event Details
          </h2>

          <div className="space-y-[43px]">
            {/* Event Type and Guest Type - Row */}
            <div className="grid grid-cols-2 gap-[69px]">
              {/* Event Type Dropdown */}
              <div className="relative">
                <label className="block text-[16px] text-[#1e1e1e] tracking-[-0.64px] mb-[10px]">
                  Event Type
                </label>
                <div className="relative">
                  <button
                    onClick={() => {
                      setEventTypeOpen(!eventTypeOpen);
                      setGuestTypeOpen(false);
                    }}
                    className="w-full h-[46px] px-4 bg-white border border-[#d1d5db] rounded-[10px] text-left text-[16px] text-[#1e1e1e] flex items-center justify-between hover:border-[#b5b5b5] transition-colors"
                  >
                    <span className={eventType ? 'text-[#1e1e1e]' : 'text-[#9ca3af]'}>
                      {eventType || 'Select event type'}
                    </span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={`transition-transform ${eventTypeOpen ? 'rotate-180' : ''}`}>
                      <path d="M7 10L12 15L17 10" stroke="#1e1e1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  
                  {eventTypeOpen && (
                    <div className="absolute z-50 mt-2 w-full bg-white border border-[#d1d5db] rounded-[10px] shadow-lg max-h-[300px] overflow-auto">
                      {eventTypeOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setEventType(option);
                            setEventTypeOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left text-[16px] text-[#1e1e1e] hover:bg-[#f3f4f6] transition-colors first:rounded-t-[10px] last:rounded-b-[10px]"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Guest Type Dropdown */}
              <div className="relative">
                <label className="block text-[16px] text-[#1e1e1e] tracking-[-0.64px] mb-[10px]">
                  Guest Type
                </label>
                <div className="relative">
                  <button
                    onClick={() => {
                      setGuestTypeOpen(!guestTypeOpen);
                      setEventTypeOpen(false);
                    }}
                    className="w-full h-[46px] px-4 bg-white border border-[#d1d5db] rounded-[10px] text-left text-[16px] text-[#1e1e1e] flex items-center justify-between hover:border-[#b5b5b5] transition-colors"
                  >
                    <span className={guestType ? 'text-[#1e1e1e]' : 'text-[#9ca3af]'}>
                      {guestType || 'Select guest type'}
                    </span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={`transition-transform ${guestTypeOpen ? 'rotate-180' : ''}`}>
                      <path d="M7 10L12 15L17 10" stroke="#1e1e1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  
                  {guestTypeOpen && (
                    <div className="absolute z-50 mt-2 w-full bg-white border border-[#d1d5db] rounded-[10px] shadow-lg max-h-[300px] overflow-auto">
                      {guestTypeOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setGuestType(option);
                            setGuestTypeOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left text-[16px] text-[#1e1e1e] hover:bg-[#f3f4f6] transition-colors first:rounded-t-[10px] last:rounded-b-[10px]"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Budget */}
            <div className="relative">
              <label className="block text-[16px] text-[#1e1e1e] tracking-[-0.64px] mb-[10px]">
                Budget
              </label>
              <div className="flex items-center gap-[10px]">
                <div className="relative flex-1 max-w-[445px]">
                  <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-[16px] text-[#1e1e1e] font-medium">
                    $
                  </span>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      setBudget(value);
                    }}
                    placeholder="0"
                    className="w-full h-[46px] pl-[30px] pr-4 bg-white border border-[#d1d5db] rounded-[10px] text-[16px] text-[#1e1e1e] focus:outline-none focus:border-[#5B52E7] transition-colors"
                  />
                </div>
                <a
                  href="https://www.nowadays.ai/budget-estimator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[16px] text-[#5B52E7] tracking-[-0.64px] underline hover:text-[#4842c7] transition-colors"
                >
                  Don't have a budget? Use the Budget Estimator →
                </a>
              </div>
            </div>

            {/* Goals & Purpose */}
            <div className="relative">
              <label className="block text-[16px] text-[#1e1e1e] tracking-[-0.64px] mb-[10px]">
                Goals & Purpose - <span className="text-[#6b7280]">Write 1-2 sentences about what you hope to achieve</span>
              </label>
              <input
                type="text"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder=""
                className="w-full h-[46px] px-4 bg-white border border-[#d1d5db] rounded-[10px] text-[16px] text-[#1e1e1e] focus:outline-none focus:border-[#5B52E7] transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-[46px]">
            <button className="h-[52px] px-[32px] bg-[#5B52E7] text-white text-[14px] font-semibold tracking-[-0.56px] rounded-[26px] border-2 border-white shadow-md hover:bg-[#4842c7] transition-colors">
              Open PDF summary
            </button>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(eventTypeOpen || guestTypeOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setEventTypeOpen(false);
            setGuestTypeOpen(false);
          }}
        />
      )}
    </div>
  );
}
