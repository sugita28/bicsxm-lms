import { useEffect } from 'react';

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title
      ? `${title} | BICSXM`
      : 'BICSXM | Learning management system';
  }, [title]);
}