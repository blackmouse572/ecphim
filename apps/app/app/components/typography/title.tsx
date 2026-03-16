export function Title({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      className={`font-bold text-3xl text-title leading-2 tracking-tight ${className}`}
      {...props}
    />
  );
}
