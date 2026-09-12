import ToolsNav from "@/components/tools/ToolsNav";

export default function ToolsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="py-6"><ToolsNav />{children}</div>;
}
