import fetchAllClasses from "@/lib/fetchers/fetchAllClasses";
import { NextApiRequest, NextApiResponse } from "next";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 5400 });

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const cachedData = cache.get("all");
    if (cachedData) {
      return res.status(200).send(cachedData);
    }

    const data = await fetchAllClasses();
    cache.set("all", data);
    return res.status(200).send(data);
  } catch (e) {
    console.log(e);
    return res.status(500).send({ success: false, msg: "An error occurred" });
  }
};

export default handler;
