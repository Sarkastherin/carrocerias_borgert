export function LogoComponent({ noTheme }: { noTheme?: boolean }) {
  return (
    <div className={`font-logo-primary text-2xl font-bold px-2 ${noTheme ? "text-gray-200" : "text-gray-700"} dark:text-gray-200`}>
      Truck
      <span
        className={`font-logo-secondary text-3xl font-bold ${noTheme ? "text-[var(--brand-primary-400)]" : "text-[var(--brand-primary-600)]"}  dark:text-[var(--brand-primary-400)]`}
      >
        Flow
      </span>
    </div>
  );
}
