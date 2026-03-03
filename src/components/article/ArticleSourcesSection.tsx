import { ExternalLink, BookOpen } from 'lucide-react';

interface Props {
  sources?: Array<{ title: string; url: string }>;
}

const ArticleSourcesSection = ({ sources }: Props) => {
  if (!sources?.length) return null;

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-primary" />
        Sources & References
      </h2>
      <ol className="list-decimal list-inside space-y-2 text-sm">
        {sources.map((source, idx) => (
          <li key={idx}>
            {source.url ? (
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                {source.title}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <span>{source.title}</span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
};

export default ArticleSourcesSection;
