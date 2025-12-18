import BadgePercent from "../../assets/icons/SettingsCogIcon";

const OfferBadge = ({ text }) => {
    return (
        <>
            <div className="w-full overflow-hidden rounded-md py-1 mt-2">
                <div className="marquee flex animate-marquee">
                    {[...Array(2)].map((_, i) => (
                        <div className="marquee-content flex" key={i}>
                            {Array(3).fill(0).map((_, j) => (
                                <span key={j} className="flex items-center mr-3 gap-3  whitespace-nowrap bg-[#f6f0e8] px-2">
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full  text-white flex-shrink-0">
                                        <BadgePercent size={12} strokeWidth={2} />
                                    </span>
                                    <span className="text-sm font-medium">{text}</span>
                                </span>
                            ))}
                            <span className="flex-shrink-0 w-16"></span>
                        </div>
                    ))}
                </div>
            </div>
            <style>
                {`
          .marquee-content { display: flex; align-items: center; white-space: nowrap; flex-shrink: 0; }
          .animate-marquee { display: flex; width: max-content; animation: marquee 20s linear infinite; }
          .marquee:hover { animation-play-state: paused; }
          @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        `}
            </style>
        </>
    );
};

export default OfferBadge;
