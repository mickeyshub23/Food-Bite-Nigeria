const EmptyState = ({ title, description, icon = '🍽️', actionText, onAction }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <span className="text-6xl mb-4">{icon}</span>
    <h2 className="font-headline font-bold text-lg text-dark_gray mb-2">{title}</h2>
    {description && <p className="text-medium_gray text-sm max-w-md mb-8">{description}</p>}
    {actionText && (
      <button onClick={onAction} className="bg-rust text-white px-6 py-2 rounded-pill font-label font-semibold hover:bg-rust/90 transition-colors">
        {actionText}
      </button>
    )}
  </div>
);

export default EmptyState;