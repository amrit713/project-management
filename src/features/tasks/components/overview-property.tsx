interface OverviewPropertyProrps {
  label: string;
  children: React.ReactNode;
}

export const OverviewProperty = ({
  label,
  children,
}: OverviewPropertyProrps) => {
  return (
    <div className="flex items-start gap-2">
      <div className="min-w-[100px]">
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
};
