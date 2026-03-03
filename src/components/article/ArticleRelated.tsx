import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import type { Article } from '@/types/enterprise';

interface Props {
  articles: Article[];
}

const ArticleRelated = ({ articles }: Props) => {
  if (!articles.length) return null;

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Related Articles</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {articles.map(related => (
          <Link key={related.id} to={`/article/${related.slug}`} className="group">
            <Card className="h-full hover:border-primary/50 transition-colors">
              <CardContent className="pt-4">
                {related.featured_image && (
                  <img src={related.featured_image} alt={related.title} className="w-full h-32 object-cover rounded mb-3" loading="lazy" />
                )}
                <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">{related.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{related.excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ArticleRelated;
