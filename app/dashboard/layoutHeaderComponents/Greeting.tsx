import type { User } from "../UserStoreProvider";
import DateRangePicker from "./DateRangePicker";

export default function Greeting({ user }: { user: User }) {
  return (
    <div className="flex flex-col grow items-start gap-3">
      <p className="text-white text-2xl lg:text-3xl">
        Welcome Back, {user.name}
      </p>
      <p className="text-faintBlue text-[13px]">
        This is your Financial Overview Report
      </p>
      <DateRangePicker />
    </div>
  );
}
