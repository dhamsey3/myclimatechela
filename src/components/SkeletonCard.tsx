const SkeletonCard = () => (
  <div className="animate-pulse border-t border-foreground/20 pt-4" aria-hidden="true">
    <div className="aspect-[16/10] rounded-sm bg-muted" />
    <div className="mt-5 h-4 w-28 rounded-sm bg-muted" />
    <div className="mt-4 h-7 w-5/6 rounded-sm bg-muted" />
    <div className="mt-2 h-7 w-2/3 rounded-sm bg-muted" />
    <div className="mt-5 h-4 w-full rounded-sm bg-muted" />
    <div className="mt-2 h-4 w-4/5 rounded-sm bg-muted" />
  </div>
);

export default SkeletonCard;
