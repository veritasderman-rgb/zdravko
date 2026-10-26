/**
 * Strukturovaná data pro vyhledávače (schema.org jako JSON-LD). Znak „<“ se přepisuje,
 * aby text z obsahu nemohl ukončit značku <script>.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
