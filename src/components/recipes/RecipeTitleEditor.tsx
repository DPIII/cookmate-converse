import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogTitle } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";

interface RecipeTitleEditorProps {
  title: string;
  isEditing: boolean;
  newTitle: string;
  onNewTitleChange: (value: string) => void;
  onEditClick: () => void;
  onSaveClick: () => void;
  onCancelClick: () => void;
}

export const RecipeTitleEditor = ({
  title,
  isEditing,
  newTitle,
  onNewTitleChange,
  onEditClick,
  onSaveClick,
  onCancelClick,
}: RecipeTitleEditorProps) => {
  if (isEditing) {
    return (
      <div className="flex gap-2 w-full">
        <Input
          value={newTitle}
          onChange={(e) => onNewTitleChange(e.target.value)}
          className="flex-1"
        />
        <Button onClick={onSaveClick}>Save</Button>
        <Button variant="outline" onClick={onCancelClick}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <>
      <DialogTitle>{title}</DialogTitle>
      <Button variant="ghost" size="icon" onClick={onEditClick}>
        <Pencil className="h-4 w-4" />
      </Button>
    </>
  );
};