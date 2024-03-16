import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function ShortHoursToggle() {
  return (
    <ToggleGroup className="gap-0" type="single" defaultValue="45">
      <ToggleGroupItem className="rounded-l-lg rounded-r-none font-bold" value="45">
        45&apos;
      </ToggleGroupItem>
      <ToggleGroupItem className="rounded-l-none rounded-r-lg font-bold" value="30">
        30&apos;
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
