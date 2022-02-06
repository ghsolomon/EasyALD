import React from 'react';
import DOMPurify from 'dompurify';

export default React.forwardRef(({ notes }, ref) => (
  <div ref={ref} className="printout">
    <ul>
      {notes.map((note) => (
        <li
          key={note.id}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(note.description, {
              USE_PROFILES: { html: true },
            }),
          }}
        ></li>
      ))}
    </ul>
  </div>
));
