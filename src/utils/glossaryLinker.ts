import { GlossaryTerm } from '@/lib/content';

export interface GlossaryLinkerOptions {
  maxLinksPerTerm?: number;
  excludeSelectors?: string[];
  caseSensitive?: boolean;
}

export class GlossaryLinker {
  private terms: GlossaryTerm[] = [];
  private termMap: Map<string, GlossaryTerm> = new Map();
  private options: Required<GlossaryLinkerOptions>;

  constructor(terms: GlossaryTerm[], options: GlossaryLinkerOptions = {}) {
    this.terms = terms;
    this.options = {
      maxLinksPerTerm: 3,
      excludeSelectors: ['a', 'code', 'pre', 'script', 'style'],
      caseSensitive: false,
      ...options
    };
    
    this.buildTermMap();
  }

  private buildTermMap(): void {
    this.termMap.clear();
    
    // Sort terms by length (longest first) to prioritize longer terms
    const sortedTerms = [...this.terms].sort((a, b) => b.term.length - a.term.length);
    
    for (const term of sortedTerms) {
      const key = this.options.caseSensitive ? term.term : term.term.toLowerCase();
      this.termMap.set(key, term);
    }
  }

  public processContent(htmlContent: string): string {
    // Parse HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Track how many times each term has been linked
    const linkCounts = new Map<string, number>();
    
    // Process text nodes
    this.processNode(doc.body, linkCounts);
    
    return doc.body.innerHTML;
  }

  private processNode(node: Node, linkCounts: Map<string, number>): void {
    // Skip if node is in excluded elements
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      if (this.options.excludeSelectors.some(selector => element.matches(selector))) {
        return;
      }
    }

    if (node.nodeType === Node.TEXT_NODE) {
      this.processTextNode(node as Text, linkCounts);
    } else {
      // Process child nodes
      const children = Array.from(node.childNodes);
      for (const child of children) {
        this.processNode(child, linkCounts);
      }
    }
  }

  private processTextNode(textNode: Text, linkCounts: Map<string, number>): void {
    let content = textNode.textContent || '';
    let hasReplacements = false;
    const replacements: Array<{
      start: number;
      end: number;
      term: GlossaryTerm;
      originalText: string;
    }> = [];

    // Find all term matches
    for (const [termKey, term] of this.termMap) {
      const currentCount = linkCounts.get(term.id) || 0;
      if (currentCount >= this.options.maxLinksPerTerm) {
        continue;
      }

      const regex = new RegExp(
        `\\b${this.escapeRegExp(term.term)}\\b`,
        this.options.caseSensitive ? 'g' : 'gi'
      );

      let match;
      while ((match = regex.exec(content)) !== null) {
        // Check if this position overlaps with existing replacements
        const overlaps = replacements.some(r => 
          (match.index >= r.start && match.index < r.end) ||
          (match.index + match[0].length > r.start && match.index + match[0].length <= r.end)
        );

        if (!overlaps && currentCount < this.options.maxLinksPerTerm) {
          replacements.push({
            start: match.index,
            end: match.index + match[0].length,
            term,
            originalText: match[0]
          });
          linkCounts.set(term.id, (linkCounts.get(term.id) || 0) + 1);
          hasReplacements = true;
        }
      }
    }

    // Apply replacements if any were found
    if (hasReplacements && replacements.length > 0) {
      // Sort replacements by start position (descending) to replace from end to start
      replacements.sort((a, b) => b.start - a.start);

      let newContent = content;
      for (const replacement of replacements) {
        const linkHtml = this.createTermLink(replacement.term, replacement.originalText);
        newContent = 
          newContent.substring(0, replacement.start) +
          linkHtml +
          newContent.substring(replacement.end);
      }

      // Replace the text node with new HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = newContent;
      
      const parent = textNode.parentNode;
      if (parent) {
        while (tempDiv.firstChild) {
          parent.insertBefore(tempDiv.firstChild, textNode);
        }
        parent.removeChild(textNode);
      }
    }
  }

  private createTermLink(term: GlossaryTerm, displayText: string): string {
    return `<a href="/topics/${term.slug}" class="glossary-link text-primary hover:underline font-medium" title="${this.escapeHtml(term.definition)}" data-term-id="${term.id}">${this.escapeHtml(displayText)}</a>`;
  }

  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// React hook for using the glossary linker
export const useGlossaryLinker = (terms: GlossaryTerm[], options?: GlossaryLinkerOptions) => {
  const linker = new GlossaryLinker(terms, options);
  
  const processContent = (htmlContent: string): string => {
    return linker.processContent(htmlContent);
  };

  return { processContent };
};

// Utility function to add FAQ schema for glossary terms
export const generateGlossaryFAQSchema = (terms: GlossaryTerm[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": terms.map(term => ({
      "@type": "Question",
      "name": `What is ${term.term}?`,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": term.definition
      }
    }))
  };
};