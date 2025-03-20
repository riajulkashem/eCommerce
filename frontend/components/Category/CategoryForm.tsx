import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

export const CategoryForm = ({
  name,
  onNameChange,
}: {
  name: string;
  onNameChange: (newName: string) => void;
}) => (
  <div className="space-y-2">
    <Label htmlFor="categoryName">Category Name</Label>
    <Input
      id="categoryName"
      value={name}
      onChange={(e) => onNameChange(e.target.value)}
      placeholder="Enter category name"
    />
  </div>
);