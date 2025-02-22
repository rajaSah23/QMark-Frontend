import { Rating } from "@mantine/core";

const RatingCard = ({ name = "", ratingValue = 5 }) => {
  return (
    <div className="flex justify-around items-center w-full text-white">
      <div className="border border-bright-sun-400 bg-mine-shaft-400/10 backdrop-blur-md w-[250px] flex flex-col gap-1 px-3 py-1 rounded-md">
        <div className="flex justify-start items-center gap-2 p-1">
          <div className="w-12 h-12 rounded-full">
            <img src="/banner-image.png" alt="img" />
          </div>
          <div>
            <div>{name}</div>
            <div>
              <Rating value={ratingValue} fractions={2} readOnly />
            </div>
          </div>
        </div>
        <div className="text-[10px]">
          This job portal made job search easy and quick. Recommended to all job seekers!
        </div>
      </div>
    </div>
  );
};

export default RatingCard;
