import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  challengeFailed: boolean;
  setChallengeFailed: (open: boolean) => void;
};

export function FailedChallengeModal({
  challengeFailed,
  setChallengeFailed,
}: Props) {
  return (
    <Dialog open={challengeFailed} onOpenChange={setChallengeFailed}>
      <DialogContent className="bg-red-700 text-white border-none">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Failed challenge, try again
          </DialogTitle>
        </DialogHeader>
        <p className="text-center text-sm">
          You missed a day. Please start a new challenge.
        </p>
      </DialogContent>
    </Dialog>
  );
}
