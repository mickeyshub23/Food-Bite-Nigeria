const Card = ({ children, className = '', ...props }) => (
  <div className={`bg-white rounded-card border border-border p-5 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;