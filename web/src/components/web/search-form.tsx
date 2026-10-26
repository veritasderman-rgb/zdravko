/**
 * Vyhledávací pole, které odešle dotaz na stránku /hledat (funguje i bez JavaScriptu).
 * `onlyStudy` omezí výsledky na text studie.
 */
export function SearchForm({ onlyStudy = false, label, placeholder, defaultValue, id }: { onlyStudy?: boolean; label: string; placeholder?: string; defaultValue?: string; id?: string }) {
  const inputId = `${id ?? "hledat"}-pole`;
  return (
    <form action="/hledat" method="get" role="search" id={id} className="flex w-full max-w-[36em] flex-col gap-2">
      <label htmlFor={inputId} className="text-[17px] font-semibold text-ink">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={inputId}
          data-ui
          name="q"
          type="search"
          defaultValue={defaultValue}
          placeholder={placeholder}
          autoComplete="off"
          enterKeyHint="search"
          className="min-h-12 min-w-0 flex-1 rounded-full border-2 border-line-strong bg-paper px-5 text-[17px] text-ink placeholder:text-muted focus:border-forest"
        />
        {onlyStudy && <input data-ui type="hidden" name="jen" value="studie" />}
        <button type="submit" className="inline-flex min-h-12 shrink-0 items-center rounded-full bg-forest px-6 text-[17px] font-bold text-on-dark hover:bg-forest-deep">
          Hledat
        </button>
      </div>
    </form>
  );
}
