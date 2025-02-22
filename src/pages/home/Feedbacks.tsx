import RatingCard from "../../components/cards/RatingCard"

const Feedbacks = () => {
  return (
    <div className="flex flex-col justify-around items-center  pt-16 text-white">
      <div className="w-full flex flex-col items-center justify-center space-y-4">
        <div className=' text-4xl font-bold'>What <span className="text-bright-sun-400">User</span> says about us?</div>
        <div className="flex justify-center items-center gap-8">
          <RatingCard name="Raja Sah" ratingValue={4} />
          <RatingCard name="Sonu Sah" ratingValue={4} />
          <RatingCard name="Monu Sah" ratingValue={4} />
          <RatingCard name="Konu Sah" ratingValue={4} />
          <RatingCard name="Ronu Sah" ratingValue={4} />
        </div>
      </div>
    </div>
  )
}

export default Feedbacks