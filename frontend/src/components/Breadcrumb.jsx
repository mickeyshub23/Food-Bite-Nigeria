import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items = [] }) => (
  <nav className="flex items-center gap-2 text-sm text-medium_gray" aria-label="Breadcrumb">
    <Link to="/" className="hover:text-rust transition-colors">Home</Link>
    {items.map((item, i) => (
      <React.Fragment key={item.label}>
        <span className="text-[0.65rem]">/</span>
        {item.href ? (
          <Link to={item.href} className="hover:text-rust transition-colors">{item.label}</Link>
        ) : (
          <span className="font-label text-dark_gray">{item.label}</span>
        )}
      </React.Fragment>
    ))}
  </nav>
);

export default Breadcrumb;