import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeViewerProps {
  code: string;
  language?: 'java' | 'sql' | 'generic' | string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ code, language = 'java' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  // Helper to parse code and return highlighted HTML
  const highlightCode = (rawCode: string, lang: string): string => {
    // Escape HTML special chars to prevent injection/broken tags
    let escaped = rawCode
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    if (lang === 'java') {
      // 1. Comments (green)
      escaped = escaped.replace(/(\/\/.*)/g, '<span class="text-emerald-600 font-normal italic">$1</span>');
      
      // 2. Strings (amber/brown)
      escaped = escaped.replace(/(&quot;.*?&quot;)/g, '<span class="text-amber-700 font-medium">$1</span>');
      
      // 3. Annotations (royal blue)
      escaped = escaped.replace(/(@[a-zA-Z0-9_]+)/g, '<span class="text-sky-600 font-semibold">$1</span>');
      
      // 4. Keywords (bold deep purple)
      const javaKeywords = [
        'public', 'private', 'protected', 'class', 'interface', 'volatile', 'transient', 
        'implements', 'extends', 'return', 'new', 'boolean', 'int', 'double', 'float', 
        'long', 'void', 'static', 'final', 'import', 'package', 'new', 'null', 'true', 'false',
        'this', 'super', 'throws', 'throw', 'try', 'catch', 'finally', 'if', 'else', 'for', 'while'
      ];
      javaKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
        escaped = escaped.replace(regex, '<span class="text-purple-600 font-semibold">$1</span>');
      });
      
      // 5. Numbers (indigo)
      escaped = escaped.replace(/\b(\d+)\b/g, '<span class="text-indigo-600">$1</span>');
    } else if (lang === 'sql') {
      // 1. Comments
      escaped = escaped.replace(/(--.*)/g, '<span class="text-emerald-600 font-normal italic">$1</span>');
      
      // 2. Strings (single quotes)
      escaped = escaped.replace(/(&#x27;.*?&#x27;|&#x27;.*?&#x27;)/g, '<span class="text-amber-700 font-medium">$1</span>');
      escaped = escaped.replace(/(\'.*?\')/g, '<span class="text-amber-700 font-medium">$1</span>');

      // 3. SQL Keywords (bold deep blue)
      const sqlKeywords = [
        'SELECT', 'FROM', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'ON', 'WHERE', 'AND', 'OR',
        'CREATE', 'TABLE', 'INSERT', 'INTO', 'VALUES', 'REFERENCES', 'PRIMARY', 'KEY',
        'DEFAULT', 'NULL', 'IF', 'NOT', 'EXISTS', 'VARCHAR', 'TEXT', 'TIMESTAMP', 'WITH',
        'TIME', 'ZONE', 'ALTER', 'ROW', 'LEVEL', 'SECURITY', 'ENABLE', 'POLICY', 'FOR',
        'TO', 'USING', 'CHECK', 'TRUNCATE', 'CASCADE', 'AS', 'ON', 'DELETE'
      ];
      sqlKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'gi'); // Case-insensitive
        escaped = escaped.replace(regex, '<span class="text-blue-700 font-semibold">$1</span>');
      });
    }

    return escaped;
  };

  const highlighted = highlightCode(code, language.toLowerCase());
  const lines = code.trim().split('\n');

  return (
    <div className="relative my-4 overflow-hidden border border-slate-200 rounded-lg bg-slate-50 text-slate-800 shadow-sm animate-fade-in max-w-full">
      {/* Code block header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-slate-100/80 text-xs font-medium text-slate-500">
        <span className="uppercase tracking-wider font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 transition-all hover:text-slate-800 focus:outline-none"
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check size={13} className="text-emerald-500 animate-pulse" />
              <span className="text-emerald-600 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code body with line numbers */}
      <div className="flex overflow-x-auto text-sm leading-relaxed p-4 font-mono select-text">
        {/* Line Numbers */}
        <div className="flex flex-col text-right select-none text-slate-300 pr-3 border-r border-slate-200/60 sticky left-0 bg-slate-50 z-10">
          {lines.map((_, idx) => (
            <span key={idx} className="h-6 leading-6 text-xs">{idx + 1}</span>
          ))}
        </div>

        {/* Code Content */}
        <pre className="pl-4 flex-1 text-left">
          <code
            className="code-block block whitespace-pre text-xs md:text-sm text-slate-700"
            style={{ fontFamily: "'Fira Code', monospace" }}
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </pre>
      </div>
    </div>
  );
};
