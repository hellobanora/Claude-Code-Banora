export function ReportLetterhead({
  patientName,
  reportDate,
}: {
  patientName: string;
  reportDate: string;
}) {
  return (
    <header className="border-b-2 border-gold pb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logo-banora.png"
            alt="Banora Chiropractic"
            className="h-10 w-auto"
          />
          <div className="text-xs leading-tight text-neutral-600">
            <div>2/44 Greenway Drive</div>
            <div>Tweed Heads South NSW 2486</div>
            <div>(07) 5599 2322</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold uppercase tracking-widest text-gold">
            Posture Assessment
          </div>
          <div className="text-[10px] text-neutral-500">PostureProClinic</div>
        </div>
      </div>
      <div className="mt-3 rounded-sm bg-gradient-to-r from-navy to-midblue px-4 py-2 text-white">
        <h1 className="text-sm font-semibold">
          Report for {patientName}
          <span className="ml-2 text-xs font-normal opacity-80">{reportDate}</span>
        </h1>
      </div>
    </header>
  );
}
