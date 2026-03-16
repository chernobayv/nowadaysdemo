import svgPaths from "./svg-a4ilcalrgf";
import imgImage4 from "figma:asset/9ecff5025de3d6deb397789c734c9c0078063c9e.png";

function HeaderText() {
  return (
    <div className="absolute contents left-[359px] top-[121px]" data-name="Header Text">
      <p className="absolute font-['Instrument_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[430px] text-[#1e1e1e] text-[64px] top-[121px] tracking-[-2.56px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Event Approval Planner
      </p>
      <p className="absolute font-['Instrument_Sans:Medium',sans-serif] font-medium leading-[normal] left-[575px] text-[#5d5d5d] text-[24px] top-[215px] tracking-[-0.96px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        From idea to sign-off in 60 seconds
      </p>
      <p className="-translate-x-1/2 absolute font-['Instrument_Sans:Regular',sans-serif] font-normal leading-[0] left-[756px] text-[#5d5d5d] text-[16px] text-center top-[277px] tracking-[-0.64px] w-[794px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <span className="leading-[normal]">{`Get a complete ready-to-send exec memo, `}</span>
        <span className="font-['Instrument_Sans:SemiBold',sans-serif] font-semibold leading-[normal]" style={{ fontVariationSettings: "'wdth' 100" }}>
          all in one place
        </span>
        <span className="leading-[normal]">. No spreadsheets, no back-and-forth. Just the numbers you need to get approved and start planning.</span>
      </p>
    </div>
  );
}

function TitleBar() {
  return (
    <div className="absolute contents left-0 top-[-10px]" data-name="Title Bar">
      <div className="absolute bg-[#fdfcfe] h-[69px] left-0 top-[-10px] w-[1512px]" />
      <div className="absolute bg-[#eeeff1] left-[1448px] rounded-[15px] size-[40px] top-[11px]">
        <div aria-hidden="true" className="absolute border border-[#c7c8ca] border-solid inset-[-1px] pointer-events-none rounded-[16px]" />
      </div>
      <div className="absolute bg-[#d9d9d9] h-[40px] left-[1346px] rounded-[15px] top-[11px] w-[90px]" />
      <div className="absolute left-[30px] size-[45px] top-[6px]" data-name="image 4">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage4} />
      </div>
      <p className="absolute font-['Instrument_Sans:Medium',sans-serif] font-medium leading-[normal] left-[92px] text-[#1e1e1e] text-[20px] top-[19px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        nowadays
      </p>
    </div>
  );
}

function FormBkg() {
  return (
    <div className="absolute contents left-[159px] top-[379px]" data-name="Form Bkg">
      <div className="absolute bg-[#fdfcfe] border border-[#b5b5b5] border-solid h-[513px] left-[159px] rounded-[20px] top-[379px] w-[1193px]" />
      <div className="absolute bg-[#5463eb] border-2 border-[#fdfcfe] border-solid h-[52px] left-[1125px] rounded-[20px] top-[814px] w-[203px]" />
      <p className="absolute font-['Instrument_Sans:SemiBold',sans-serif] font-semibold leading-[normal] left-[1166px] text-[#fdfcfe] text-[14px] top-[831px] tracking-[-0.56px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Open PDF summary
      </p>
    </div>
  );
}

function Budget() {
  return (
    <div className="absolute contents left-[282px] top-[592px]" data-name="budget">
      <p className="absolute font-['Instrument_Sans:Regular',sans-serif] font-normal h-[21px] leading-[normal] left-[282px] text-[#1e1e1e] text-[16px] top-[592px] tracking-[-0.64px] w-[350px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Budget
      </p>
      <div className="absolute bg-[#fdfcfe] border border-[#b5b5b5] border-solid h-[46px] left-[282px] rounded-[10px] top-[623px] w-[445px]" />
      <div className="absolute left-[291px] overflow-clip size-[21px] top-[635px]" data-name="Dollar sign">
        <div className="absolute bottom-[4.17%] left-1/4 right-1/4 top-[4.17%]" data-name="Icon">
          <div className="absolute inset-[-6.49%_-11.9%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 21.75">
              <path d={svgPaths.p2d2a1900} id="Icon" stroke="var(--stroke-0, #1E1E1E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function GuestType() {
  return (
    <div className="absolute contents left-[790px] top-[486px]" data-name="guest type">
      <p className="absolute font-['Instrument_Sans:Regular',sans-serif] font-normal h-[21px] leading-[normal] left-[790px] text-[#1e1e1e] text-[16px] top-[486px] tracking-[-0.64px] w-[350px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Guest Type
      </p>
      <div className="absolute bg-[#fdfcfe] border border-[#b5b5b5] border-solid h-[46px] left-[790px] rounded-[10px] top-[517px] w-[445px]" />
      <div className="absolute left-[1188px] overflow-clip size-[24px] top-[528px]" data-name="arrow_drop_down">
        <div className="absolute inset-[41.67%_29.17%_37.5%_29.17%]" data-name="icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 5">
            <path d="M5 5L0 0H10L5 5Z" fill="var(--fill-0, #1D1B20)" id="icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function EventType() {
  return (
    <div className="absolute contents left-[276px] top-[486px]" data-name="event type">
      <p className="absolute font-['Instrument_Sans:Regular',sans-serif] font-normal h-[21px] leading-[normal] left-[276px] text-[#1e1e1e] text-[16px] top-[486px] tracking-[-0.64px] w-[350px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Event Type
      </p>
      <div className="absolute bg-[#fdfcfe] border border-[#b5b5b5] border-solid h-[46px] left-[276px] rounded-[10px] top-[517px] w-[445px]" />
      <div className="absolute left-[674px] overflow-clip size-[24px] top-[528px]" data-name="arrow_drop_down">
        <div className="absolute inset-[41.67%_29.17%_37.5%_29.17%]" data-name="icon">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 5">
            <path d="M5 5L0 0H10L5 5Z" fill="var(--fill-0, #1D1B20)" id="icon" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function GoalsPurpose() {
  return (
    <div className="absolute contents left-[276px] top-[708px]" data-name="Goals & Purpose">
      <p className="absolute font-['Instrument_Sans:Regular',sans-serif] font-normal h-[21px] leading-[0] left-[276px] text-[#1e1e1e] text-[16px] top-[708px] tracking-[-0.64px] w-[650px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <span className="leading-[normal]">{`Goals & Purpose - `}</span>
        <span className="leading-[normal] text-[#5d5d5d]">Write 1-2 sentences about what you hope to achieve</span>
      </p>
      <div className="absolute bg-[#fdfcfe] border border-[#b5b5b5] border-solid h-[46px] left-[276px] rounded-[10px] top-[739px] w-[877px]" />
    </div>
  );
}

function Form() {
  return (
    <div className="absolute contents left-[208px] top-[422px]" data-name="Form">
      <p className="absolute decoration-solid font-['Instrument_Sans:Regular',sans-serif] font-normal leading-[normal] left-[800px] text-[#5a68ec] text-[16px] top-[636px] tracking-[-0.64px] underline w-[397px] whitespace-pre-wrap" style={{ fontVariationSettings: "'wdth' 100" }}>{`Don’t have a budget? Use the Budget Estimator  →`}</p>
      <Budget />
      <GuestType />
      <EventType />
      <GoalsPurpose />
      <p className="absolute font-['Instrument_Sans:Medium',sans-serif] font-medium h-[21px] leading-[normal] left-[208px] text-[20px] text-black top-[422px] tracking-[-0.8px] w-[350px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Event Details
      </p>
    </div>
  );
}

export default function Desktop() {
  return (
    <div className="bg-white relative size-full" data-name="Desktop - 1">
      <div className="absolute h-[1440px] left-[-8px] top-[-422px] w-[1527px]" data-name="Bkg color">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1527 1440">
          <path d="M0 0H1527V1440H0V0Z" fill="url(#paint0_radial_1_73)" id="Bkg color" />
          <defs>
            <radialGradient cx="0" cy="0" gradientTransform="matrix(1284.59 -1232 1306.43 841.25 80.1675 169)" gradientUnits="userSpaceOnUse" id="paint0_radial_1_73" r="1">
              <stop stopColor="#D9C8D3" stopOpacity="0.25" />
              <stop offset="0.588369" stopColor="#FDF8F9" />
              <stop offset="1" stopColor="#B5C9D2" stopOpacity="0.25" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <HeaderText />
      <TitleBar />
      <FormBkg />
      <Form />
    </div>
  );
}
