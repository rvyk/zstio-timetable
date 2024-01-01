import Image from "next/legacy/image";

function Event() {
  if (new Date().getMonth() === 11) {
    return (
      <div className="absolute z-40 -translate-x-[0.8rem] -translate-y-[1.1rem] w-24 h-24">
        <Image
          alt="czapka"
          src={"/czapka.png"}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
    );
  }
}

export default Event;
