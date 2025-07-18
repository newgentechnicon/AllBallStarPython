import { useState } from "react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown } from "lucide-react"

const GROUPED_OPTIONS = [
  {
    label: "Dominant",
    options: [
      { label: "Calico", value: "calico" },
      { label: "Confusion", value: "confusion" },
      { label: "Harlequin", value: "harlequin" },
    ],
  },
  {
    label: "Co-Dominant",
    options: [
      { label: "Leopard", value: "leopard" },
      { label: "Pinstripe", value: "pinstripe" },
    ],
  },
]

export function MultiSelectGrouped() {
  const [selected, setSelected] = useState<string[]>([])

  const toggleOption = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[280px] justify-between"
        >
          {selected.length > 0
            ? `${selected.length} selected`
            : "Select options"}
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] max-h-[300px] overflow-y-auto p-2 space-y-2">
        {GROUPED_OPTIONS.map((group) => (
          <div key={group.label}>
            {/* Group Label + Divider */}
            <div className="flex items-center mb-1">
              <span className="text-sm font-medium text-muted-foreground">
                {group.label}
              </span>
              <div className="flex-1 border-b border-gray-200 ml-2" />
            </div>

            {/* Items */}
            <div className="space-y-1">
              {group.options.map((option) => {
                const isChecked = selected.includes(option.value)
                return (
                  <div
                    key={option.value}
                    className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
                    onClick={() => toggleOption(option.value)}
                  >
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor={option.value}
                        className="text-sm cursor-pointer"
                      >
                        {option.label}
                      </label>
                    </div>

                    {isChecked && <Check className="h-4 w-4 text-blue-500" />}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}
