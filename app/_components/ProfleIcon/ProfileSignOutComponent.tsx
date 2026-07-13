import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ProfileSignOutComponent({
  handler,
  isLoggingOut,
}: {
  handler: () => void;
  isLoggingOut: boolean;
}) {
  return (
    <button
      type="button"
      onClick={handler}
      disabled={isLoggingOut}
      className="flex w-full text-left text-sm text-gray-700 hover:bg-gray-100 p-3 cursor-pointer justify-start items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
    >
      <FontAwesomeIcon
        icon={faArrowRightFromBracket}
        className="size-3 text-gray-500"
      />
      <p>{isLoggingOut ? "Signing out…" : "Sign out"}</p>
    </button>
  );
}
