"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { updateSearchParams } from "@/utils/updateSearchParams";

type PropsType = {
  pageNumber: number;
  allShown: boolean;
};
export const ShowMoreButton = ({ pageNumber, allShown }: PropsType) => {
  const router = useRouter();

  const handleShowMore = () => {
    const newLimit = (pageNumber + 1) * 10;

    const newPathname = updateSearchParams({ limit: newLimit });

    router.push(newPathname, { scroll: false });
  };

  return (
    <div className="w-full flex-center gap-5 mt-10">
      {!allShown && (
        <Button
          btnType="button"
          title="Show More"
          containerStyles="bg-primary-blue rounded-full text-white"
          handleClick={handleShowMore}
        />
      )}
    </div>
  );
};
